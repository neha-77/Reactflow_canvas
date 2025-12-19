import type { Node, Edge } from 'reactflow';
export interface AppData {
  id: string;
  name: string;
  icon: string;
}

export interface GraphData {
  nodes: Node<ServiceNodeData>[];
  edges: Edge[];
}

export interface ServiceNodeData {
  label: string;
  status: 'healthy' | 'degraded' | 'down';
  cpu: number;
  memory: number;
  disk: number;
  region: string;
  sliderValue: number;
  description?: string;
}