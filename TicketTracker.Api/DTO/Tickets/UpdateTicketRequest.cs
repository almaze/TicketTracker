using System.ComponentModel.DataAnnotations;
using TicketTracker.Api.Models;

namespace TicketTracker.Api.DTO.Tickets;

public class UpdateTicketRequest : IValidatableObject
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public string Priority { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
    {
        if (!Enum.TryParse<TicketPriority>(
                Priority,
                true,
                out _))
        {
            yield return new ValidationResult(
                "Priority must be Low, Medium, or High.",
                new[] { nameof(Priority) });
        }

        if (!Enum.TryParse<TicketStatus>(
                Status,
                true,
                out _))
        {
            yield return new ValidationResult(
                "Status must be Open, InProgress, or Closed.",
                new[] { nameof(Status) });
        }
    }
}