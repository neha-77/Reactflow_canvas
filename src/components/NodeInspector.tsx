import React, { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import { useAppStore } from '@/store/appStore';
import type { ServiceNodeData } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface NodeInspectorProps {
  node: Node<ServiceNodeData>;
  onUpdateNode: (nodeId: string, data: Partial<ServiceNodeData>) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, onUpdateNode }) => {
  const { activeInspectorTab, setActiveInspectorTab } = useAppStore();
  const [sliderValue, setSliderValue] = useState([node.data.sliderValue]);
  const [nodeName, setNodeName] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.description || '');

  useEffect(() => {
    setSliderValue([node.data.sliderValue]);
    setNodeName(node.data.label);
    setDescription(node.data.description || '');
  }, [node.id, node.data]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    onUpdateNode(node.id, { sliderValue: value[0] });
  };

  const handleNumericInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));
    setSliderValue([clampedValue]);
    onUpdateNode(node.id, { sliderValue: clampedValue });
  };

  const getStatusVariant = () => {
    switch (node.data.status) {
      case 'healthy':
        return 'default';
      case 'degraded':
        return 'secondary';
      case 'down':
        return 'destructive';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-foreground font-semibold">Service Node</h3>
          <Badge variant={getStatusVariant()}>
            {node.data.status.charAt(0).toUpperCase() + node.data.status.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{node.data.label}</div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeInspectorTab}
        onValueChange={(value) => setActiveInspectorTab(value as 'config' | 'runtime')}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="config" className="flex-1">Config</TabsTrigger>
          <TabsTrigger value="runtime" className="flex-1">Runtime</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nodeName">Node Name</Label>
            <Input
              id="nodeName"
              value={nodeName}
              onChange={(e) => {
                setNodeName(e.target.value);
                onUpdateNode(node.id, { label: e.target.value });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Resource Allocation</Label>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">0%</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={sliderValue[0]}
                onChange={(e) => handleNumericInputChange(e.target.value)}
                className="w-20 text-center"
              />
              <span className="text-xs text-muted-foreground">100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                onUpdateNode(node.id, { description: e.target.value });
              }}
              placeholder="Enter description..."
            />
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-secondary p-3 rounded-lg">
            <Label className="text-xs text-muted-foreground">CPU Usage</Label>
            <div className="text-foreground font-mono mt-1">{node.data.cpu}</div>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <Label className="text-xs text-muted-foreground">Memory</Label>
            <div className="text-foreground font-mono mt-1">{node.data.memory} GB</div>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <Label className="text-xs text-muted-foreground">Disk</Label>
            <div className="text-foreground font-mono mt-1">{node.data.disk} GB</div>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <Label className="text-xs text-muted-foreground">Region</Label>
            <div className="text-foreground font-mono mt-1">{node.data.region}</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};