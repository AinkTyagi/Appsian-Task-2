using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManager.Api.Application.DTOs;
using ProjectManager.Api.Application.Services;
using ProjectManager.Api.Infrastructure.Data;
using System.Security.Claims;

namespace ProjectManager.Api.Api.Controllers;

[ApiController]
[Route("api/v1/projects")]
[Authorize]
public class SchedulerController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ISchedulerService _schedulerService;
    private readonly ILogger<SchedulerController> _logger;

    public SchedulerController(
        ApplicationDbContext context,
        ISchedulerService schedulerService,
        ILogger<SchedulerController> logger)
    {
        _context = context;
        _schedulerService = schedulerService;
        _logger = logger;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }

    [HttpPost("{projectId}/schedule")]
    public async Task<ActionResult<ScheduleResponse>> GenerateSchedule(
        Guid projectId,
        [FromBody] ScheduleRequest request)
    {
        try
        {
            var userId = GetUserId();

            // Verify project ownership
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return NotFound(new { error = "Project not found" });
            }

            // Generate schedule
            var response = _schedulerService.GenerateSchedule(request);

            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating schedule");
            return StatusCode(500, new { error = "An error occurred while generating the schedule" });
        }
    }
}
