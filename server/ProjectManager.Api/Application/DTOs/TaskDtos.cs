using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Application.DTOs;

public class CreateTaskRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }
}

public class UpdateTaskRequest
{
    [StringLength(200, MinimumLength = 1)]
    public string? Title { get; set; }

    public DateTime? DueDate { get; set; }

    public bool? IsCompleted { get; set; }
}

public class TaskDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
