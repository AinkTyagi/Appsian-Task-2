using ProjectManager.Api.Application.DTOs;

namespace ProjectManager.Api.Application.Services;

public class SchedulerService : ISchedulerService
{
    public ScheduleResponse GenerateSchedule(ScheduleRequest request)
    {
        // Validate input
        if (request.Tasks == null || request.Tasks.Count == 0)
        {
            return new ScheduleResponse { RecommendedOrder = new List<string>() };
        }

        // Build dependency graph
        var taskMap = request.Tasks.ToDictionary(t => t.Title, t => t);
        var graph = new Dictionary<string, List<string>>();
        var inDegree = new Dictionary<string, int>();

        foreach (var task in request.Tasks)
        {
            if (!graph.ContainsKey(task.Title))
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }
        }

        // Build edges and calculate in-degrees
        foreach (var task in request.Tasks)
        {
            foreach (var dep in task.Dependencies)
            {
                if (!taskMap.ContainsKey(dep))
                {
                    throw new InvalidOperationException($"Dependency '{dep}' not found in task list");
                }

                graph[dep].Add(task.Title);
                inDegree[task.Title]++;
            }
        }

        // Detect cycles using DFS
        var visited = new HashSet<string>();
        var recursionStack = new HashSet<string>();

        foreach (var task in request.Tasks)
        {
            if (HasCycle(task.Title, graph, visited, recursionStack))
            {
                throw new InvalidOperationException("Circular dependency detected. Tasks cannot be scheduled.");
            }
        }

        // Topological sort with priority queue
        var result = new List<string>();
        var ready = new List<string>();

        // Find all tasks with no dependencies
        foreach (var task in request.Tasks)
        {
            if (inDegree[task.Title] == 0)
            {
                ready.Add(task.Title);
            }
        }

        while (ready.Count > 0)
        {
            // Sort ready tasks by priority
            ready = SortByPriority(ready, taskMap);

            // Take the highest priority task
            var current = ready[0];
            ready.RemoveAt(0);
            result.Add(current);

            // Update dependencies
            foreach (var neighbor in graph[current])
            {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0)
                {
                    ready.Add(neighbor);
                }
            }
        }

        // Check if all tasks were scheduled (no cycles)
        if (result.Count != request.Tasks.Count)
        {
            throw new InvalidOperationException("Unable to schedule all tasks. Circular dependency detected.");
        }

        return new ScheduleResponse { RecommendedOrder = result };
    }

    private bool HasCycle(string task, Dictionary<string, List<string>> graph, 
        HashSet<string> visited, HashSet<string> recursionStack)
    {
        if (recursionStack.Contains(task))
        {
            return true;
        }

        if (visited.Contains(task))
        {
            return false;
        }

        visited.Add(task);
        recursionStack.Add(task);

        foreach (var neighbor in graph[task])
        {
            if (HasCycle(neighbor, graph, visited, recursionStack))
            {
                return true;
            }
        }

        recursionStack.Remove(task);
        return false;
    }

    private List<string> SortByPriority(List<string> tasks, Dictionary<string, ScheduleTaskInput> taskMap)
    {
        return tasks.OrderBy(t =>
        {
            var task = taskMap[t];
            
            // Parse due date (null dates go last)
            DateTime? dueDate = null;
            if (!string.IsNullOrEmpty(task.DueDate))
            {
                if (DateTime.TryParse(task.DueDate, out var parsed))
                {
                    dueDate = parsed;
                }
            }

            return (dueDate ?? DateTime.MaxValue, task.EstimatedHours, t);
        })
        .ToList();
    }
}
