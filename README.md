# Ekinshop Project

Ekinshop is a modern e-commerce web application built using cutting-edge technologies such as **Next.js**, **.NET**, and **Microsoft Azure**. The platform allows users to browse products, view details, and manage a shopping cart. It is designed with scalability, security, and performance in mind, leveraging Azure services like CosmosDB, Blob Storage, and AKS.

## Prerequisites
- Azure CLI
- Terraform
- Docker
- Kubernetes CLI
- Python
- Access to an Azure subscription


## Deployment workflow for ekinshop project

**1. Login to Azure CLI**
First, authenticate to Azure CLI and select the appropriate subscription:

```bash
az login
az account set --subscription "SUBSCRIPTION-ID"
```

**2. Initialize Terraform**
Initialize Terraform to set up the infrastructure configuration:

```bash
terraform init
```

**3. Deploy Infrastructure Resources**
Apply the Terraform configuration to create necessary resources in Azure:

```bash
terraform apply
```

**4. Get Azure Container Registry (ACR) Details**
Retrieve the ACR name and Login Server URL:

```bash
az acr list --query "[?starts_with(name, 'ekinshop')].{Name:name, LoginServer:loginServer}" --output table
```

**5. Build Docker Images**

```bash
cd api
docker build -t REGISTRY-URL/api:latest .
cd ../frontend
docker build -t REGISTRY-URL/frontend:latest .
cd ..
```

**6. Authenticate to ACR**
Log in to Azure Container Registry (ACR):

```bash
az acr login --name REGISTRY-NAME
```

**7. Push Docker Images to ACR**
Push the Docker images for the API and frontend to the ACR:

```bash
docker push REGISTRY-URL/api:latest
docker push REGISTRY-URL/frontend:latest
```

**8. Get AKS Cluster Details**
Retrieve the AKS cluster name and resource group:

```bash
az aks list --query "[?starts_with(name, 'ekinshop')].{Name:name, ResourceGroup:resourceGroup}" --output table
```

**9. Configure AKS Cluster**
Log in to the AKS cluster and configure it for deployment:

**Login to AKS Cluster**
```bash
az aks get-credentials --resource-group RG-NAME --name CLUSTER-NAME
```

**Enable Azure Key Vault Secret Provider**
```bash
az aks enable-addons --addons azure-keyvault-secrets-provider --name CLUSTER-NAME --resource-group RG-NAME
```

**Grant AKS Access to ACR**
Attach the ACR to the AKS cluster for image pulling:
```bash
az aks update -n CLUSTER-NAME -g RG-NAME --attach-acr REGISTRY-NAME
```

**Retrive cluster assignee id**
```bash
az aks show --resource-group RG-NAME --name CLUSTER-NAME --query "identityProfile.kubeletidentity.clientId" -o tsv
```

**Grant AKS Access to Key Vault**
Assign the Key Vault Secrets User role to the AKS cluster:
```bash
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee AKS-ASSIGNEE-ID \
  --scope $(az keyvault show --name KV-NAME --query id -o tsv)
```

**10. Setup configmap and secrets**

Before proceeding with the deployment, update the configuration for `ConfigMap` and `SecretProviderClass` with the appropriate values for their environment.

**Copy template files**
```bash
cp k8s/configmap/api-config.yml.template k8s/configmap/api-config.yml
cp k8s/configmap/frontend-config.yml.template k8s/configmap/frontend-config.yml
cp k8s/secrets/api-secret.yml.template k8s/secrets/api-secret.yml
```

**Update API ConfigMap**
Edit the `api-config` ConfigMap to include the required values, such as the Cosmos DB endpoint and database name:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  CosmosDb__AccountEndpoint: '<INSERT-COSMOSDB-ENDPOINT>'
  CosmosDb__DatabaseName: '<INSERT-COSMOSDB-DATABASE-NAME>'
```
- Replace `<INSERT-COSMOSDB-ENDPOINT>` with your Cosmos DB account endpoint.
- Replace `<INSERT-COSMOSDB-DATABASE-NAME>` with your Cosmos DB database name.

**Update Frontend ConfigMap**
Edit the frontend-config ConfigMap to provide the API and Blob Storage URLs:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  API_URL: 'http://api-service:8080'
  BLOB_URL: '<INSERT-BLOB-STORAGE-URL>'
```
- Replace `<INSERT-BLOB-STORAGE-URL>` with the URL for your Blob Storage.

**Update SecretProviderClass**
Edit the SecretProviderClass to include the appropriate values for your Azure Key Vault and user-assigned identity:

```yaml
---
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: '<INSERT-USER-ASSIGNED-IDENTITY-ID>'
    keyvaultName: "<INSERT-KV-NAME>"
    tenantId: '<INSERT-TENANT-ID>'
    cloudName: ""
    objects: |
      array:
        - |
          objectName: "CosmosDb-AccountKey"
          objectType: secret
  secretObjects:
    - secretName: cosmosdb-secret
      type: Opaque
      data:
        - objectName: "CosmosDb-AccountKey"
          key: CosmosDb-AccountKey
```
- Replace `<INSERT-USER-ASSIGNED-IDENTITY-ID>` with the ID of your Azure Managed Identity.
- Replace `<INSERT-KV-NAME>` with name of your Azure Key Vault
- Replace `<INSERT-TENANT-ID>` with your Azure Tenant ID.

**11. Update Deployment Files**

Before deploying the API and frontend applications, ensure that the deployment files are updated to reference your own Azure Container Registry (ACR) URL. Replace the `image` field in the `api` and `frontend` deployment YAML files with the correct ACR URL.

**12. Add cosmos secret to key vault**

az keyvault secret set --vault-name VAULT-NAME --name CosmosDb-AccountKey --value COSMOS-SECRET

**13. Update exemple data (optional)**

Prepare python virtual environment
```bash
python3 -m venv venv
```

Activate the environment
```bash
source venv/bin/activate
```

Install required dependencies
```bash
pip3 install -r requirements.txt
```

Create .env.local with `APP_ID` variable and insert suffix generated when terraform was run
```
APP_ID=
```

Run the script
```bash
python3 main.py
```

Deactivate the environment
```bash
deactivate
```

**14. Deploy API to Kubernetes**
Navigate to the Kubernetes configuration directory and apply the API configurations:

```bash
cd k8s/
kubectl apply -f configmap/api-config.yml
kubectl apply -f secrets/api-secret.yml
kubectl apply -f deployments/api-deploy.yml
kubectl apply -f services/api-service.yml
cd ..
```

**15. Deploy Frontend to Kubernetes**
Similarly, apply the frontend configurations:

```bash
cd k8s/
kubectl apply -f configmap/frontend-config.yml
kubectl apply -f deployments/frontend-deploy.yml
kubectl apply -f services/frontend-service.yml
cd ..
```

## Run the application
After successful deploy application run below command and get public IP of application
```bash
kubectl get services
```

## Destroy application
```bash
cd k8s/
kubectl delete -f services/frontend-service.yml
kubectl delete -f services/api-service.yml
kubectl delete -f deployments/frontend-deploy.yml
kubectl delete -f deployments/api-deploy.yml
kubectl delete -f secrets/api-secret.yml
kubectl delete -f configmap/api-config.yml
kubectl delete -f configmap/frontend-config.yml
cd ..
```


## Destroy infrastructure
```bash
terraform destroy
```