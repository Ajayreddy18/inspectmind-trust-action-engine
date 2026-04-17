"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

type Cluster = {
  cluster_id: string
  trust_score: number
  priority_score: number
  raw_count: number
  next_action: string
  root_cause: string
  historically_validated?: boolean
  validation_count?: number
  representative: {
    issue_type: string
    sheet: string
    evidence_regions: string[]
  }
}

const sampleFindings = [
  {
    id: "f-101",
    issue_type: "fire_door_mismatch",
    sheet: "A601",
    discipline: "architectural",
    text: "Door D12 marked solid wood, schedule says HM-90 fire-rated",
    cv_confidence: 0.88,
    evidence_regions: ["A601 • Door D12", "D201 • Schedule mismatch"],
  },
  {
    id: "f-102",
    issue_type: "fire_door_mismatch",
    sheet: "D201",
    discipline: "schedule",
    text: "Door D12 HM-90 conflict with architectural tag",
    cv_confidence: 0.91,
    evidence_regions: ["D201 • HM-90", "A601 • Door tag"],
  },
  {
    id: "f-103",
    issue_type: "wall_thickness_conflict",
    sheet: "S401",
    discipline: "structural",
    text: "Wall W7 thickness 150mm differs from A201 200mm",
    cv_confidence: 0.86,
    evidence_regions: ["S401 • 150mm", "A201 • 200mm"],
  },
  {
    id: "f-104",
    issue_type: "beam_alignment_conflict",
    sheet: "S501",
    discipline: "structural",
    text: "Beam B12 centerline offset conflicts with reflected ceiling grid",
    cv_confidence: 0.89,
    evidence_regions: ["S501 • Beam B12", "RCP • Ceiling grid"],
  },
  {
    id: "f-105",
    issue_type: "hvac_clearance_violation",
    sheet: "M302",
    discipline: "mechanical",
    text: "Duct clearance below beam is insufficient for maintenance access",
    cv_confidence: 0.92,
    evidence_regions: ["M302 • Main duct", "S501 • Beam depth"],
  },
  {
    id: "f-106",
    issue_type: "sprinkler_head_collision",
    sheet: "FP201",
    discipline: "fire_protection",
    text: "Sprinkler head overlaps with lighting fixture in corridor",
    cv_confidence: 0.90,
    evidence_regions: ["FP201 • Sprinkler layout", "RCP • Light fixture"],
  },
]

function ProgressBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: "#e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.round(value * 100)}%`,
            height: "100%",
            background: tone,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  )
}

export default function Page() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Cluster | null>(null)

  async function runTriage() {
    const res = await fetch("http://localhost:8000/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sampleFindings),
    })

    const data = await res.json()
    setClusters(data.clusters || [])
    return data.clusters || []
  }

  useEffect(() => {
    async function load() {
      try {
        await runTriage()
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function confirmSelectedIssue() {
    if (!selected) return

    try {
      await fetch("http://localhost:8000/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue_type: selected.representative.issue_type,
        }),
      })

      const updatedClusters = await runTriage()

      const updatedSelected = updatedClusters.find(
        (c: Cluster) =>
          c.representative.issue_type ===
          selected.representative.issue_type
      )

      setSelected(updatedSelected || null)
    } catch (error) {
      console.error(error)
    }
  }

  const blockers = useMemo(
    () => clusters.filter((c) => c.priority_score >= 0.9),
    [clusters]
  )

  const reviews = useMemo(
    () => clusters.filter((c) => c.priority_score < 0.9),
    [clusters]
  )

  if (loading) {
    return <div style={{ padding: 40 }}>Loading premium dashboard...</div>
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #eef2ff 0%, #f8fafc 40%, #ffffff 100%)",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "white",
            borderRadius: 28,
            padding: 28,
            boxShadow: "0 20px 60px rgba(15,23,42,0.18)",
          }}
        >
          <p style={{ letterSpacing: 3, fontSize: 12, opacity: 0.8 }}>
            INSPECTMIND AI • TRUST LAYER
          </p>
          <h1 style={{ fontSize: 40, margin: "10px 0" }}>
            Premium Engineering Intelligence
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9 }}>
            Adaptive trust orchestration for construction AI workflows
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            marginTop: 24,
          }}
        >
          {[
            ["Permit Blockers", blockers.length, AlertTriangle],
            ["Architect Reviews", reviews.length, ClipboardList],
            ["Average Trust", "0.93", ShieldCheck],
            ["Trend Uplift", "+18%", BarChart3],
          ].map(([title, value, Icon]: any, i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 24,
                padding: 22,
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 14 }}>
                  {title}
                </span>
                <Icon size={18} />
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  marginTop: 10,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 22,
            marginTop: 24,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: 22,
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ fontSize: 28 }}>Workflow Intelligence</h2>

            {[{ title: "Critical Permit Blockers", items: blockers, bg: "#fef2f2", tone: "#dc2626" },
              { title: "Architect Review Queue", items: reviews, bg: "#fffbeb", tone: "#d97706" }].map(
              (lane: any, idx) => (
                <div
                  key={idx}
                  style={{
                    background: lane.bg,
                    borderRadius: 22,
                    padding: 18,
                    marginBottom: 18,
                  }}
                >
                  <h3 style={{ fontSize: 22 }}>{lane.title}</h3>

                  {lane.items.map((c: Cluster) => (
                    <div
                      key={c.cluster_id}
                      onClick={() => setSelected(c)}
                      style={{
                        background: "white",
                        borderRadius: 18,
                        padding: 18,
                        marginTop: 12,
                        cursor: "pointer",
                      }}
                    >
                      <strong style={{ fontSize: 20 }}>
                        {c.representative.issue_type}
                      </strong>
                      <div style={{ fontSize: 15, marginTop: 6 }}>
                        Trust {c.trust_score} • Priority {c.priority_score}
                      </div>

                      {c.historically_validated && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 13,
                            color: "#15803d",
                            fontWeight: 600,
                          }}
                        >
                           Historically Validated ×{c.validation_count}
                        </div>
                      )}

                      <ProgressBar
                        value={c.trust_score}
                        tone={lane.tone}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: 22,
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ fontSize: 24 }}>Explainability Panel</h2>

            {!selected ? (
              <div style={{ marginTop: 20, color: "#64748b" }}>
                Select an issue card to inspect evidence and trust reasoning.
              </div>
            ) : (
              <div style={{ marginTop: 20 }}>
                <p>
                  <strong>Issue:</strong>{" "}
                  {selected.representative.issue_type}
                </p>
                <p style={{ lineHeight: 1.6 }}>
                  <strong>Root Cause:</strong> {selected.root_cause}
                </p>

                <div style={{ marginTop: 16 }}>
                  <strong>Evidence Regions</strong>
                  {selected.representative.evidence_regions.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        marginTop: 8,
                        padding: 12,
                        borderRadius: 12,
                        background: "#f8fafc",
                      }}
                    >
                      {r}
                    </div>
                  ))}
                </div>

                <button
                  onClick={confirmSelectedIssue}
                  style={{
                    marginTop: 18,
                    width: "100%",
                    padding: 14,
                    borderRadius: 16,
                    border: 0,
                    background: "#0f172a",
                    color: "white",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  <CheckCircle2 size={18} /> Confirm Engineering Action
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}