export default function InsightsPanel({ clusters }: { clusters: any[] }) {
  const topBlockers = clusters.filter((c) => c.priority_score >= 0.9).length
  const architectReviews = clusters.filter((c) =>
    c.next_action?.toLowerCase().includes("architect")
  ).length

  const avgTrust =
    clusters.length > 0
      ? (
          clusters.reduce((sum, c) => sum + c.trust_score, 0) /
          clusters.length
        ).toFixed(2)
      : "0"

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-bold mb-4">
        Top 10 Daily Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-50 p-4 border">
          <p className="text-sm">Permit Blockers</p>
          <p className="text-2xl font-bold">{topBlockers}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border">
          <p className="text-sm">Architect Reviews</p>
          <p className="text-2xl font-bold">{architectReviews}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border">
          <p className="text-sm">Average Trust</p>
          <p className="text-2xl font-bold">{avgTrust}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 border">
          <p className="text-sm">Estimated Rework Risk</p>
          <p className="text-2xl font-bold">High</p>
        </div>
      </div>
    </div>
  )
}