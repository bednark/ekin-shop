using Microsoft.AspNetCore.Mvc;
using ekinshop.Models;

namespace ekinshop.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase {
  private readonly CosmosDbContext _cosmosDbContext;

  public ProductController(CosmosDbContext cosmosDbContext) {
    _cosmosDbContext = cosmosDbContext;
  }

  [HttpGet("{id:int}")]
  public async Task<IActionResult> Get(int id) {
    var product = await _cosmosDbContext.GetItemAsync<Product>(id.ToString());
    if (product == null) {
      return NotFound();
    }
    return Ok(product);
  }
}