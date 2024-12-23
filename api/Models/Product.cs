namespace ekinshop.Models;

public class Product {
  public int? productId { get; set; }
  public string? name { get; set; }
  public string? brand { get; set; }
  public decimal? price { get; set; }
  public string? size { get; set; }
  public string? image { get; set; }
  public string? description { get; set; }
}