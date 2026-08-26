using Microsoft.AspNetCore.Identity;

namespace TicketTracker.Api.Services;

public class PasswordService
{
    private readonly PasswordHasher<object> _hasher = new();

    public string HashPassword(string password)
    {
        return _hasher.HashPassword(null!, password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        var result = _hasher.VerifyHashedPassword(
            null!,
            passwordHash,
            password
        );

        return result == PasswordVerificationResult.Success;
    }
}