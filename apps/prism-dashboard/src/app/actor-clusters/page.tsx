"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { API_BASE_URL } from "@/lib/api";

interface Cluster {
  id: string;
  title: string;
  confidence: number;
  robustness: number;
  node_count: number;
}

export default function ActorClustersPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/clusters/all`)
      .then((res) => res.json())
      .then((data) => {
        setClusters(data.clusters || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch clusters:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <Users className="text-cream" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-cream tracking-tight font-space-grotesk">Macro Threat Actor Clusters</h1>
          <p className="text-sm text-platinum/70 mt-1">Cross-referenced infrastructure & behavioral metadata groups</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cream"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map((cluster) => (
            <Link href={`/investigation/${cluster.id}`} key={cluster.id}>
              <div className="clay-card p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer border border-amber-950/10 hover:border-amber-950/30 relative overflow-hidden group shadow-lg">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <h2 className="text-xl font-bold text-midnight mb-1 font-space-grotesk">{cluster.title || cluster.id}</h2>
                <p className="text-xs text-midnight/60 font-mono mb-6">{cluster.id}</p>
                
                <div className="flex justify-between items-center text-sm gap-2">
                  <div className="flex items-center gap-1.5 bg-emerald-950/10 px-2.5 py-1 rounded-lg border border-emerald-900/15">
                    <ShieldCheck className="text-emerald-800 shrink-0" size={15} />
                    <span className="text-xs font-semibold text-emerald-950">{(cluster.confidence * 100).toFixed(1)}% Fusion</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-950/10 px-2.5 py-1 rounded-lg border border-amber-900/15">
                    <AlertTriangle className={`${cluster.robustness < 0.5 ? "text-rose-800" : "text-amber-800"} shrink-0`} size={15} />
                    <span className="text-xs font-semibold text-amber-950">{(cluster.robustness * 100).toFixed(1)}% Robust</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-midnight/10 flex justify-between items-center text-xs">
                  <span className="font-medium text-midnight/70">Connected Nodes</span>
                  <span className="font-mono font-bold text-midnight bg-midnight/10 px-2.5 py-0.5 rounded-full">{cluster.node_count}</span>
                </div>
              </div>
            </Link>
          ))}
          {clusters.length === 0 && (
            <div className="col-span-full text-center py-20 text-platinum/70">
              <AlertTriangle size={48} className="mx-auto mb-4 text-amber-400 opacity-80" />
              <p className="text-lg font-semibold text-cream">No macro clusters found in Neo4j database.</p>
              <p className="text-sm mt-2 text-platinum/60">Make sure you ran the data seeder!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
