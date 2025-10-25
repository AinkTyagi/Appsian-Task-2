export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
      <div className="text-center">
        <div className="relative">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20"></div>
          <div className="absolute inset-0 inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-nexus-500"></div>
        </div>
        <p className="mt-6 text-white/70 text-lg font-medium">Loading your workspace...</p>
      </div>
    </div>
  );
};
