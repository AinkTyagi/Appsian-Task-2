using ProjectManager.Api.Application.DTOs;
using ProjectManager.Api.Application.Services;
using Xunit;

namespace ProjectManager.Tests.Services;

public class SchedulerServiceTests
{
    [Fact]
    public void GenerateSchedule_ShouldReturnCorrectOrderForLinearDependencies()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Design API", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Implement Backend", EstimatedHours = 12, DueDate = "2025-10-28", Dependencies = new List<string> { "Design API" } },
                new() { Title = "Build Frontend", EstimatedHours = 10, DueDate = "2025-10-30", Dependencies = new List<string> { "Design API" } },
                new() { Title = "End-to-End Test", EstimatedHours = 8, DueDate = "2025-10-31", Dependencies = new List<string> { "Implement Backend", "Build Frontend" } }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal(4, response.RecommendedOrder.Count);
        Assert.Equal("Design API", response.RecommendedOrder[0]);
        Assert.Equal("End-to-End Test", response.RecommendedOrder[3]);
    }

    [Fact]
    public void GenerateSchedule_ShouldDetectCircularDependency()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task A", EstimatedHours = 5, Dependencies = new List<string> { "Task B" } },
                new() { Title = "Task B", EstimatedHours = 5, Dependencies = new List<string> { "Task C" } },
                new() { Title = "Task C", EstimatedHours = 5, Dependencies = new List<string> { "Task A" } }
            }
        };

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => schedulerService.GenerateSchedule(request));
        Assert.Contains("Circular dependency", exception.Message);
    }

    [Fact]
    public void GenerateSchedule_ShouldPrioritizeByDueDate()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task B", EstimatedHours = 5, DueDate = "2025-10-30", Dependencies = new List<string>() },
                new() { Title = "Task A", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task C", EstimatedHours = 5, DueDate = "2025-11-01", Dependencies = new List<string>() }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal("Task A", response.RecommendedOrder[0]); // Earliest due date
        Assert.Equal("Task B", response.RecommendedOrder[1]);
        Assert.Equal("Task C", response.RecommendedOrder[2]);
    }

    [Fact]
    public void GenerateSchedule_ShouldPrioritizeByEstimatedHoursWhenDueDatesSame()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task B", EstimatedHours = 10, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task A", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task C", EstimatedHours = 15, DueDate = "2025-10-25", Dependencies = new List<string>() }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal("Task A", response.RecommendedOrder[0]); // Shortest estimated hours
        Assert.Equal("Task B", response.RecommendedOrder[1]);
        Assert.Equal("Task C", response.RecommendedOrder[2]);
    }

    [Fact]
    public void GenerateSchedule_ShouldPrioritizeLexicographicallyWhenAllElseEqual()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task C", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task A", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task B", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal("Task A", response.RecommendedOrder[0]); // Lexicographically first
        Assert.Equal("Task B", response.RecommendedOrder[1]);
        Assert.Equal("Task C", response.RecommendedOrder[2]);
    }

    [Fact]
    public void GenerateSchedule_ShouldHandleTasksWithNoDueDate()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task A", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "Task B", EstimatedHours = 5, Dependencies = new List<string>() }, // No due date
                new() { Title = "Task C", EstimatedHours = 5, DueDate = "2025-10-30", Dependencies = new List<string>() }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal("Task A", response.RecommendedOrder[0]); // Earliest due date
        Assert.Equal("Task C", response.RecommendedOrder[1]);
        Assert.Equal("Task B", response.RecommendedOrder[2]); // No due date goes last
    }

    [Fact]
    public void GenerateSchedule_ShouldThrowExceptionForMissingDependency()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "Task A", EstimatedHours = 5, Dependencies = new List<string> { "NonExistent Task" } }
            }
        };

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => schedulerService.GenerateSchedule(request));
        Assert.Contains("not found", exception.Message);
    }

    [Fact]
    public void GenerateSchedule_ShouldReturnEmptyForEmptyInput()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>()
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Empty(response.RecommendedOrder);
    }

    [Fact]
    public void GenerateSchedule_ShouldHandleComplexDependencyGraph()
    {
        // Arrange
        var schedulerService = new SchedulerService();
        var request = new ScheduleRequest
        {
            Tasks = new List<ScheduleTaskInput>
            {
                new() { Title = "A", EstimatedHours = 5, DueDate = "2025-10-25", Dependencies = new List<string>() },
                new() { Title = "B", EstimatedHours = 5, DueDate = "2025-10-26", Dependencies = new List<string> { "A" } },
                new() { Title = "C", EstimatedHours = 5, DueDate = "2025-10-27", Dependencies = new List<string> { "A" } },
                new() { Title = "D", EstimatedHours = 5, DueDate = "2025-10-28", Dependencies = new List<string> { "B", "C" } },
                new() { Title = "E", EstimatedHours = 5, DueDate = "2025-10-29", Dependencies = new List<string> { "C" } }
            }
        };

        // Act
        var response = schedulerService.GenerateSchedule(request);

        // Assert
        Assert.Equal(5, response.RecommendedOrder.Count);
        Assert.Equal("A", response.RecommendedOrder[0]);
        
        // B and C should come after A
        var indexA = response.RecommendedOrder.IndexOf("A");
        var indexB = response.RecommendedOrder.IndexOf("B");
        var indexC = response.RecommendedOrder.IndexOf("C");
        var indexD = response.RecommendedOrder.IndexOf("D");
        var indexE = response.RecommendedOrder.IndexOf("E");
        
        Assert.True(indexB > indexA);
        Assert.True(indexC > indexA);
        Assert.True(indexD > indexB && indexD > indexC);
        Assert.True(indexE > indexC);
    }
}
