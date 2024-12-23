FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /app

COPY ekin-shop.csproj ./
RUN dotnet restore "./ekin-shop.csproj"

COPY . .

RUN mv appsettings.json.template appsettings.json

RUN dotnet publish "ekin-shop.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app

RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api

COPY --from=builder --chown=api:api /app/publish .

USER api

EXPOSE 8080

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ekin-shop.dll"]