using Microsoft.Azure.Cosmos;

namespace ekinshop;

public class CosmosDbContext {
  private readonly CosmosClient _cosmosClient;
  private readonly Database _database;
  private readonly Container _container;

  public CosmosDbContext(string endpoint, string key, string databaseName, string containerName) {
    _cosmosClient = new CosmosClient(endpoint, key);
    _database = _cosmosClient.GetDatabase(databaseName);
    _container = _database.GetContainer(containerName);
  }

  public async Task<IEnumerable<T>> GetAllItemsAsync<T>() {
    var query = _container.GetItemQueryIterator<T>(new QueryDefinition("SELECT * FROM c"));
    var results = new List<T>();

    while (query.HasMoreResults) {
      var response = await query.ReadNextAsync();
      results.AddRange(response);
    }

    return results;
  }

  public async Task<IEnumerable<T>> GetItemAsync<T>(string id) {
    var query = new QueryDefinition("SELECT * FROM c WHERE c.productId = @id")
      .WithParameter("@id", id);

    var iterator = _container.GetItemQueryIterator<T>(query);
    var results = new List<T>();

    while (iterator.HasMoreResults){
      var response = await iterator.ReadNextAsync();
      results.AddRange(response);
    }

    return results;
  }
}