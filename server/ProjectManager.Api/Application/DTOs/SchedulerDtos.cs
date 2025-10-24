using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Application.DTOs;

public class ScheduleRequest
{
    [Required]
    public List<ScheduleTaskInput> Tasks { get; set; } = new();
}

public class ScheduleTaskInput
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Range(0.1, 1000)]
    public double EstimatedHours { get; set; }

    public string? DueDate { get; set; }

    public List<string> Dependencies { get; set; } = new();
}

public class ScheduleResponse
{
    public List<string> RecommendedOrder { get; set; } = new();
}
