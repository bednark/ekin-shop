using Microsoft.AspNetCore.Mvc;
using ekinshop.Models;

namespace ekinshop.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase {
  private static readonly List<Product> products = new List<Product> {
    new Product { Id = 1, Name = "Buty Nike", Brand = "Nike", Price = 299, Size = "42", Image = "/buty.webp", Description = "Wygodne buty sportowe Nike" },
    new Product { Id = 2, Name = "Kurtka Adidas", Brand = "Adidas", Price = 499, Size = "M", Image = "/kurtka.webp", Description = "Stylowa kurtka Adidas na każdą pogodę" },
    new Product { Id = 3, Name = "T-shirt Puma", Brand = "Puma", Price = 99, Size = "L", Image = "/t-shirt.webp", Description = "Komfortowy T-shirt Puma" },
    new Product { Id = 4, Name = "Spodnie Levi's", Brand = "Levi's", Price = 249, Size = "32", Image = "/spodnie.webp", Description = "Klasyczne spodnie Levi's" },
    new Product { Id = 5, Name = "Buty Nike", Brand = "Nike", Price = 299, Size = "42", Image = "/buty.webp", Description = "Wygodne buty sportowe Nike" },
    new Product { Id = 6, Name = "Kurtka Adidas", Brand = "Adidas", Price = 499, Size = "M", Image = "/kurtka.webp", Description = "Stylowa kurtka Adidas na każdą pogodę" },
    new Product { Id = 7, Name = "T-shirt Puma", Brand = "Puma", Price = 99, Size = "L", Image = "/t-shirt.webp", Description = "Komfortowy T-shirt Puma" },
    new Product { Id = 8, Name = "Spodnie Levi's", Brand = "Levi's", Price = 249, Size = "32", Image = "/spodnie.webp", Description = "Klasyczne spodnie Levi's" }
  };

  [HttpGet("{id:int}")]
  public IActionResult Get(int id) {
    var product = products.FirstOrDefault(p => p.Id == id);
    if (product == null) {
      return NotFound();
    }
    return Ok(product);
  }
}