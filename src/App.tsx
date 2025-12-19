import React, { useState, useCallback } from 'react';
import type { Node } from 'reactflow';
import { X } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { LeftRail } from './components/LeftRail';
import { FlowCanvas } from './components/FlowCanvas';
import { NodeInspector } from './components/NodeInspector';
import { useAppStore } from './store/appStore';
import type { ServiceNodeData } from './types';
import { Button } from './components/ui/button';

const App: React.FC = () => {
  const { selectedNodeId, isMobilePanelOpen, setMobilePanelOpen } = useAppStore();
  const [nodes, setNodes] = useState<Node<ServiceNodeData>[]>([]);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  const handleNodesChange = useCallback((newNodes: Node<ServiceNodeData>[]) => {
    setNodes(newNodes);
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, data: Partial<ServiceNodeData>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Icon Rail */}
        <LeftRail />
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Main Canvas */}
          <div className="flex-1">
            <FlowCanvas 
              onNodesChange={handleNodesChange} 
              externalNodes={nodes}
            />
          </div>
          
          {/* Node Inspector */}
          {selectedNode && (
            <div className="w-80 bg-card border-l border-border flex-col flex">
              <NodeInspector node={selectedNode} onUpdateNode={handleUpdateNode} />
            </div>
          )}
        </div>
        
        {/* Mobile Layout */}
        <div className="flex-1 lg:hidden">
          <FlowCanvas 
            onNodesChange={handleNodesChange}
            externalNodes={nodes}
          />
        </div>
        
        {/* Mobile Drawer */}
        {isMobilePanelOpen && selectedNode && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobilePanelOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-card flex flex-col">
              <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="text-foreground font-semibold">Node Inspector</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobilePanelOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <NodeInspector node={selectedNode} onUpdateNode={handleUpdateNode} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;