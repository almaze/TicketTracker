using Microsoft.EntityFrameworkCore;
using TicketTracker.Api.Data;
using TicketTracker.Api.Models;

namespace TicketTracker.Api.Tests;

public class TicketOwnershipTests
{
    [Fact]
    public async Task UserCannotFetchAnotherUsersTicket()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        await using var db = new ApplicationDbContext(options);

        var user1 = new User
        {
            Email = "user1@example.com"
        };

        var user2 = new User
        {
            Email = "user2@example.com"
        };

        db.Users.AddRange(user1, user2);
        await db.SaveChangesAsync();

        var ticket = new Ticket
        {
            Title = "User 2 ticket",
            Description = "Private ticket",
            Priority = "Low",
            Status = "Open",
            OwnerId = user2.Id
        };

        db.Tickets.Add(ticket);
        await db.SaveChangesAsync();

        var result = await db.Tickets
            .FirstOrDefaultAsync(t =>
                t.Id == ticket.Id &&
                t.OwnerId == user1.Id);

        Assert.Null(result);
    }
}