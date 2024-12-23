using Microsoft.AspNetCore.Mvc;
using ekinshop.Models;

namespace ekinshop.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase {
  private readonly CosmosDbContext _cosmosDbContext;

  public ProductsController(CosmosDbContext cosmosDbContext) {
    _cosmosDbContext = cosmosDbContext;
  }

  [HttpGet]
  public async Task<IActionResult> Get() {
    var products = await _cosmosDbContext.GetAllItemsAsync<Product>();
    return Ok(products);
  }
}