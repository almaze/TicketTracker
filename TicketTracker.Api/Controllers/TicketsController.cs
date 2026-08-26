using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketTracker.Api.Data;
using TicketTracker.Api.DTO.Tickets;
using TicketTracker.Api.Models;
using System.IdentityModel.Tokens.Jwt;

namespace TicketTracker.Api.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TicketsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket(CreateTicketRequest request)
    {
        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userIdClaim is null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var ticket = new Ticket
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            Status = request.Status,
            OwnerId = userId
        };

        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();

        return Ok(ticket);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userIdClaim is null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var tickets = await _db.Tickets
            .Where(ticket => ticket.OwnerId == userId)
            .ToListAsync();

        return Ok(tickets);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicket(int id)
    {
        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userIdClaim is null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var ticket = await _db.Tickets
            .FirstOrDefaultAsync(ticket =>
                ticket.Id == id &&
                ticket.OwnerId == userId);

        if (ticket is null)
        {
            return NotFound();
        }

        return Ok(ticket);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTicket(
        int id,
        UpdateTicketRequest request)
    {
        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (userIdClaim is null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var ticket = await _db.Tickets
            .FirstOrDefaultAsync(ticket =>
                ticket.Id == id &&
                ticket.OwnerId == userId);

        if (ticket is null)
        {
            return NotFound();
        }

        ticket.Title = request.Title;
        ticket.Description = request.Description;
        ticket.Priority = request.Priority;
        ticket.Status = request.Status;

        await _db.SaveChangesAsync();

        return Ok(ticket);
    }
}