
export function ArchitectureOverview() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-5">📋 Overview</h2>
      <p className="text-lg text-gray-700 leading-relaxed">
        Sports Central is organized into feature-based apps within a monorepo structure. 
        Each feature app is independent but shares common infrastructure, enabling better 
        organization, easier maintenance, and improved performance.
      </p>
    </div>
  );
}