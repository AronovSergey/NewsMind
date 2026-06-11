export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/70" />
        <div className="p-6 space-y-3">
          <div className="h-4 bg-gray-100 rounded-full w-3/4" />
          <div className="h-4 bg-gray-100 rounded-full w-full" />
          <div className="h-4 bg-gray-100 rounded-full w-5/6" />
          <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2 mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
