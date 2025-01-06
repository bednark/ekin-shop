import dotenv
from azure.cosmos import CosmosClient, exceptions
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
import json
import os

dotenv.load_dotenv('.env.local', override=True)

APP_ID = os.getenv('APP_ID')

cosmosdb_account = f'https://ekinshop{APP_ID}.documents.azure.com:443/'
storage_account_name = f'https://ekinshop{APP_ID}.blob.core.windows.net/'
db_name = 'ekin-shop'
container_name = 'products'

def add_documents_to_cosmosdb():
  try:
    credentials = DefaultAzureCredential()
    client = CosmosClient(cosmosdb_account, credentials)

    database = client.get_database_client(db_name)
    container = database.get_container_client(container_name)

    query = "SELECT * FROM p"
    items = list(container.query_items(query, enable_cross_partition_query=True))

    if items:
      print('Container is not empty. Skipping the addition of documents.')
      return

    with open('example-data/data.json') as f:
      products = json.load(f)

      for product in products:
        container.create_item(body=product, enable_automatic_id_generation=True)
    
    print('Documents added to CosmosDB successfully.')
  except exceptions.CosmosHttpResponseError as e:
    print('There was an error in CosmosDB:', e)
  except Exception as e:
    print('There was an error:', e)

def add_images_to_storage():
  try:
    client = BlobServiceClient(account_url=storage_account_name, credential=DefaultAzureCredential())
    container = client.get_container_client(container_name)

    blobs = list(container.list_blobs())

    if blobs:
      print('Container is not empty. Skipping the addition of images.')
      return

    for image in os.listdir('example-data/images'):
      with open(f'example-data/images/{image}', 'rb') as f:
        container.upload_blob(name=image, data=f)
  except Exception as e:
    print('There was an error:', e)

add_documents_to_cosmosdb()
add_images_to_storage()