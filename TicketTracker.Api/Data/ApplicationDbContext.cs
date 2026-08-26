using Microsoft.EntityFrameworkCore;
using TicketTracker.Api.Models;

namespace TicketTracker.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Ticket> Tickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(user => user.Tickets)
            .WithOne(ticket => ticket.Owner)
            .HasForeignKey(ticket => ticket.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}