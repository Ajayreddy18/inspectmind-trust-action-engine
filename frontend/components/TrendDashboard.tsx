export default function TrendDashboard({ trends }: { trends: any }) {
  const entries = Object.entries(trends)

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Project-Level Trend Memory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map(([issue, data]: any) => (
          <div
            key={issue}
            className="rounded-xl border bg-slate-50 p-4"
          >
            <p className="font-medium">{issue}</p>
            <p className="text-sm">Occurrences: {data.count}</p>
            <p className="text-sm">
              Avg Trust: {data.avg_trust}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}