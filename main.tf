terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.93.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

variable "location" {
  default     = "westeurope"
  description = "Primary location for resources"
}

variable "secondary_location" {
  default     = "germanywestcentral"
  description = "Secondary location for CosmosDB geo-replication"
}

variable "tags" {
  default = {
    environment = "production"
    project     = "ekinshop"
  }
  description = "Tags for resources"
}

data "azurerm_client_config" "current" {}

resource "random_string" "unique_suffix" {
  length  = 8
  special = false
  upper   = false
  keepers = {
    project = "ekinshop"
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "ekinshop${random_string.unique_suffix.result}"
  location = var.location
  tags     = var.tags
}

resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                = "ekinshop${random_string.unique_suffix.result}"
  location            = var.secondary_location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  tags                = var.tags

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.secondary_location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "database" {
  name                = "ekin-shop"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
}

resource "azurerm_cosmosdb_sql_container" "products_table" {
  name                = "products"
  resource_group_name = azurerm_resource_group.rg.name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  database_name       = azurerm_cosmosdb_sql_database.database.name
  partition_key_path  = "/productId"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "ekinshop${random_string.unique_suffix.result}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  access_tier              = "Hot"
  tags                     = var.tags
}

resource "azurerm_storage_container" "products_blob" {
  name                  = "products"
  storage_account_name  = azurerm_storage_account.storage_account.name
  container_access_type = "container"
}

resource "azurerm_container_registry" "container_registry" {
  name                = "ekinshop${random_string.unique_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  sku                 = "Basic"
  tags                = var.tags
}

resource "azurerm_key_vault" "key_vault" {
  name                            = "ekinshop${random_string.unique_suffix.result}"
  resource_group_name             = azurerm_resource_group.rg.name
  location                        = var.location
  sku_name                        = "standard"

  tenant_id                       = data.azurerm_client_config.current.tenant_id
  enable_rbac_authorization       = true
  enabled_for_deployment          = true
  enabled_for_template_deployment = true
  tags                            = var.tags
}

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "ekinshop${random_string.unique_suffix.result}"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "ekinshop"
  tags                = var.tags

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "kubenet"
  }
}

resource "azurerm_role_assignment" "kv_admin" {
  scope               = azurerm_key_vault.key_vault.id
  role_definition_name = "Key Vault Administrator"
  principal_id        = data.azurerm_client_config.current.object_id
}

resource "azurerm_cosmosdb_sql_role_assignment" "cosmosdb_role_assignment" {
  account_name         = azurerm_cosmosdb_account.cosmosdb.name
  resource_group_name  = azurerm_resource_group.rg.name
  role_definition_id   = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/resourceGroups/${azurerm_resource_group.rg.name}/providers/Microsoft.DocumentDB/databaseAccounts/${azurerm_cosmosdb_account.cosmosdb.name}/sqlRoleDefinitions/00000000-0000-0000-0000-000000000002"
  scope                = azurerm_cosmosdb_account.cosmosdb.id
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "storage_blob_data_contributor" {
  scope                = azurerm_storage_account.storage_account.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}