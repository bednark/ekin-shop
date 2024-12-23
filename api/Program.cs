using ekinshop;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSingleton<CosmosDbContext>(provider => {
  var configuration = provider.GetRequiredService<IConfiguration>();
  var endpoint = configuration["CosmosDb:AccountEndpoint"] ?? throw new ArgumentNullException("CosmosDb:AccountEndpoint");
  var key = configuration["CosmosDb:AccountKey"] ?? throw new ArgumentNullException("CosmosDb:AccountKey");
  var databaseName = configuration["CosmosDb:DatabaseName"] ?? throw new ArgumentNullException("CosmosDb:DatabaseName");
  var containerName = "products";

  return new CosmosDbContext(endpoint, key, databaseName, containerName);
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseDeveloperExceptionPage();
}

app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapControllers();

app.Run();