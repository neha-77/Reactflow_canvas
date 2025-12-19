import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Connection, NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';
import { fetchGraph } from '@/api/mockApi';
import { ServiceNode } from './ServiceNode';
import type { ServiceNodeData } from '@/types';

const nodeTypes: NodeTypes = {
  serviceNode: ServiceNode,
};

interface FlowCanvasProps {
  onNodesChange: (nodes: Node<ServiceNodeData>[]) => void;
  externalNodes: Node<ServiceNodeData>[]; // NEW: receive nodes from parent
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({ onNodesChange: onNodesChangeParent, externalNodes }) => {
  const { selectedAppId, selectedNodeId, setSelectedNodeId } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<ServiceNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ['graph', selectedAppId],
    queryFn: () => fetchGraph(selectedAppId!),
    enabled: !!selectedAppId,
  });

  // Load initial graph data
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
    }
  }, [graphData, setNodes, setEdges]);

  // Sync external node updates (from inspector) back to ReactFlow
  useEffect(() => {
    if (externalNodes.length > 0) {
      setNodes((currentNodes) => {
        return currentNodes.map((node) => {
          const externalNode = externalNodes.find((n) => n.id === node.id);
          if (externalNode) {
            // Merge the updated data while preserving position
            return {
              ...node,
              data: {
                ...node.data,
                ...externalNode.data,
              },
            };
          }
          return node;
        });
      });
    }
  }, [externalNodes, setNodes]);

  // Notify parent of node changes
  useEffect(() => {
    onNodesChangeParent(nodes);
  }, [nodes, onNodesChangeParent]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
        setEdges((eds) =>
          eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
        );
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, setNodes, setEdges, setSelectedNodeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-muted-foreground">Loading graph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-destructive">Error loading graph. Please try again.</div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-background"
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls />
      <Panel position="top-right" className="bg-card p-2 rounded border border-border text-xs text-muted-foreground">
        Press Delete/Backspace to remove selected node
      </Panel>
    </ReactFlow>
  );
};