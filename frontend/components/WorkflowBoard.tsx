"use client"

import { useState } from "react"
import EvidenceModal from "./EvidenceModal"

const lanes = [
  "Top Permit Blockers",
  "Needs Architect Review",
  "Contractor Follow-up",
  "Resolved"
]

export default function WorkflowBoard({ clusters }: { clusters: any[] }) {
  const [selectedCluster, setSelectedCluster] = useState<any | null>(null)

  const grouped = {
    "Top Permit Blockers": clusters.filter(
      (c) => c.priority_score >= 0.9
    ),

    "Needs Architect Review": clusters.filter(
      (c) =>
        c.priority_score < 0.9 &&
        c.next_action?.toLowerCase().includes("architect")
    ),

    "Contractor Follow-up": clusters.filter(
      (c) =>
        c.priority_score < 0.9 &&
        c.next_action?.toLowerCase().includes("contractor")
    ),

    "Resolved": []
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {lanes.map((lane) => (
          <div key={lane} className="rounded-2xl border p-4 bg-slate-50">
            <h2 className="font-semibold mb-3">{lane}</h2>

            <div className="space-y-3">
              {grouped[lane as keyof typeof grouped].map((cluster: any) => (
                <button
                  key={cluster.cluster_id}
                  onClick={() => setSelectedCluster(cluster)}
                  className="w-full text-left rounded-xl bg-white border p-3 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-medium">
                    {cluster.representative.issue_type}
                  </p>
                  <p className="text-sm">Trust: {cluster.trust_score}</p>
                  <p className="text-sm">
                    Priority: {cluster.priority_score}
                  </p>
                  <p className="text-sm">
                    Duplicates: {cluster.raw_count}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCluster && (
        <EvidenceModal cluster={selectedCluster} />
      )}
    </div>
  )
}