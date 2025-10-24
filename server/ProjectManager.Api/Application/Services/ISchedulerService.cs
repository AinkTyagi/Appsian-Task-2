using ProjectManager.Api.Application.DTOs;

namespace ProjectManager.Api.Application.Services;

public interface ISchedulerService
{
    ScheduleResponse GenerateSchedule(ScheduleRequest request);
}
