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
    <Link to={`/projects/${project.id}`} className="block group">
      <div className="card-nexus floating-card group-hover:glow-nexus">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-nexus-400 to-nexus-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-nexus-300 transition-colors duration-200">
                {project.title}
              </h3>
            </div>
            {project.description && (
              <p className="text-white/70 mb-4 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
            <div className="flex items-center text-sm text-white/60 space-x-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="ml-4 p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            title="Delete project"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};
