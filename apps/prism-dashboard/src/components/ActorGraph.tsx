"use client";

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MarkerType,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// A custom node style to fit the Cyber-Clay-Glass aesthetic
const nodeStyles = {
  background: 'var(--color-glass-bg)',
  backdropFilter: 'blur(10px)',
  border: '1px solid var(--color-glass-border)',
  borderRadius: '50%', // Orb shape
  padding: '15px',
  color: 'var(--color-platinum)',
  width: 100,
  height: 100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center' as const,
  fontSize: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
};

const actorNodeStyle = {
  ...nodeStyles,
  background: 'var(--color-cream)',
  color: 'var(--color-midnight)',
  boxShadow: '8px 8px 16px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.2)',
  fontWeight: 'bold'
};

const alertNodeStyle = {
  ...nodeStyles,
  border: '2px solid #ef4444',
  boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
};

export interface GraphInputNode {
  id?: string | number;
  position?: { x: number; y: number };
  data?: {
    label?: string;
    type?: string;
    alert?: boolean;
    [key: string]: unknown;
  };
  style?: React.CSSProperties;
}

export interface GraphInputEdge {
  id?: string | number;
  source?: string | number;
  target?: string | number;
  label?: string;
  [key: string]: unknown;
}

interface ActorGraphProps {
  initialNodes?: GraphInputNode[];
  initialEdges?: GraphInputEdge[];
}

export default function ActorGraph({ initialNodes = [], initialEdges = [] }: ActorGraphProps) {
  // Map API data to React Flow structure
  const formattedNodes = useMemo(() => {
    const safeNodes = Array.isArray(initialNodes) ? initialNodes : [];
    return safeNodes.map((n, i) => {
      let style = nodeStyles;
      const nodeType = n?.data?.type || "";
      if (nodeType === "ActorCluster" || nodeType === "Persona") {
        style = actorNodeStyle;
      } else if (n?.data?.alert) {
        style = alertNodeStyle;
      }
      
      return {
        id: String(n?.id ?? i),
        position: n?.position && (n.position.x !== 0 || n.position.y !== 0) 
          ? n.position 
          : { x: (i % 3) * 150 + 50, y: Math.floor(i / 3) * 150 + 50 },
        data: { label: n?.data?.label || n?.id || "Node" },
        style
      };
    });
  }, [initialNodes]);

  const formattedEdges = useMemo(() => {
    const safeEdges = Array.isArray(initialEdges) ? initialEdges : [];
    return safeEdges.map((e, i) => ({
      id: String(e?.id ?? `edge-${i}`),
      source: String(e?.source ?? ""),
      target: String(e?.target ?? ""),
      label: e?.label || "",
      style: { stroke: 'var(--color-platinum)', opacity: 0.5 },
      labelStyle: { fill: 'var(--color-platinum)', fontSize: 10 },
      labelBgStyle: { fill: 'var(--color-midnight)' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'var(--color-platinum)',
      },
    }));
  }, [initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(formattedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(formattedEdges);

  React.useEffect(() => {
    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [formattedNodes, formattedEdges, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="rgba(255, 255, 255, 0.08)" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
