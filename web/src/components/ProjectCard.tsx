import { Link } from 'react-router-dom';
import { ProjectListItem } from '../types';

interface ProjectCardProps {
  project: ProjectListItem;
  onDelete: (id: string) => void;
}

export const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      onDelete(project.id);
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
            {project.description && (
              <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}</span>
              <span>•</span>
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="ml-4 text-red-600 hover:text-red-800 transition-colors"
            title="Delete project"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};
