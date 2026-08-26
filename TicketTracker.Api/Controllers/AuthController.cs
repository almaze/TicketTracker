using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketTracker.Api.Data;
using TicketTracker.Api.DTOs.Auth;
using TicketTracker.Api.Models;
using TicketTracker.Api.Services;

namespace TicketTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly PasswordService _passwordService;
    private readonly JwtService _jwtService;

    public AuthController(
        ApplicationDbContext db,
        PasswordService passwordService,
        JwtService jwtService)
    {
        _db = db;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var existingUser = await _db.Users
            .FirstOrDefaultAsync(user => user.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict(new
            {
                success = false,
                message = "Email is already registered."
            });
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordService.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "User registered successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(user => user.Email == request.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        var passwordValid = _passwordService.VerifyPassword(
            request.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Invalid email or password."
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            success = true,
            message = "Login successful.",
            data = new
            {
                token
            }
        });
    }
}