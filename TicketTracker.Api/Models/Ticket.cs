using System.ComponentModel.DataAnnotations;

namespace TicketTracker.Api.Models;

public class Ticket
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string Priority { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;

    public int OwnerId { get; set; }

    public User Owner { get; set; } = null!;
}