using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ProjectManager.Api.Application.DTOs;
using ProjectManager.Api.Application.Services;
using ProjectManager.Api.Infrastructure.Data;
using Xunit;

namespace ProjectManager.Tests.Services;

public class AuthServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private IConfiguration GetConfiguration()
    {
        var inMemorySettings = new Dictionary<string, string>
        {
            {"JWT:Key", "test-secret-key-must-be-at-least-32-characters-long"},
            {"JWT:Issuer", "TestIssuer"},
            {"JWT:Audience", "TestAudience"}
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();
    }

    [Fact]
    public void HashPassword_ShouldReturnDifferentHashForSamePassword()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var password = "TestPassword123!";

        // Act
        var hash1 = authService.HashPassword(password);
        var hash2 = authService.HashPassword(password);

        // Assert
        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void VerifyPassword_ShouldReturnTrueForCorrectPassword()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var password = "TestPassword123!";
        var hash = authService.HashPassword(password);

        // Act
        var result = authService.VerifyPassword(password, hash);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void VerifyPassword_ShouldReturnFalseForIncorrectPassword()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var password = "TestPassword123!";
        var wrongPassword = "WrongPassword456!";
        var hash = authService.HashPassword(password);

        // Act
        var result = authService.VerifyPassword(wrongPassword, hash);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task RegisterAsync_ShouldCreateNewUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        // Act
        var response = await authService.RegisterAsync(request);

        // Assert
        Assert.NotNull(response);
        Assert.NotEmpty(response.Token);
        Assert.Equal(request.Email, response.User.Email);
        Assert.NotEqual(Guid.Empty, response.User.Id);
    }

    [Fact]
    public async Task RegisterAsync_ShouldThrowExceptionForDuplicateEmail()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var request = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        await authService.RegisterAsync(request);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            async () => await authService.RegisterAsync(request));
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnTokenForValidCredentials()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var registerRequest = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        await authService.RegisterAsync(registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        // Act
        var response = await authService.LoginAsync(loginRequest);

        // Assert
        Assert.NotNull(response);
        Assert.NotEmpty(response.Token);
        Assert.Equal(loginRequest.Email, response.User.Email);
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowExceptionForInvalidEmail()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var loginRequest = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "TestPassword123!"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await authService.LoginAsync(loginRequest));
    }

    [Fact]
    public async Task LoginAsync_ShouldThrowExceptionForInvalidPassword()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var config = GetConfiguration();
        var authService = new AuthService(context, config);
        var registerRequest = new RegisterRequest
        {
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        await authService.RegisterAsync(registerRequest);

        var loginRequest = new LoginRequest
        {
            Email = "test@example.com",
            Password = "WrongPassword456!"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await authService.LoginAsync(loginRequest));
    }
}
