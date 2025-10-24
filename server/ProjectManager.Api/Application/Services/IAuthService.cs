using ProjectManager.Api.Application.DTOs;

namespace ProjectManager.Api.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}
