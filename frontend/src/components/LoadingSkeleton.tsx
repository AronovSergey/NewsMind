export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
