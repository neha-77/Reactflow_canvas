import React from 'react';
import { Database, Settings, Box, Package, Network } from 'lucide-react';
import type { ServiceNodeData } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ServiceNodeProps {
  data: ServiceNodeData;
  selected: boolean;
}

export const ServiceNode: React.FC<ServiceNodeProps> = ({ data, selected }) => {
  const getStatusVariant = () => {
    switch (data.status) {
      case 'healthy':
        return 'default';
      case 'degraded':
        return 'secondary';
      case 'down':
        return 'destructive';
    }
  };

  const getStatusLabel = () => {
    switch (data.status) {
      case 'healthy':
        return 'Success';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Error';
    }
  };

  return (
    <div
      className={`bg-card border-2 rounded-lg p-4 min-w-[280px] transition-colors ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
            <Database className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-foreground font-medium">{data.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            $0.03/HR
          </Badge>
          <Settings className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
        <div className="text-center">
          <div className="text-foreground">{data.cpu}</div>
          <div className="text-muted-foreground flex items-center justify-center gap-1">
            <Box className="w-3 h-3" />
            CPU
          </div>
        </div>
        <div className="text-center">
          <div className="text-foreground">{data.memory} GB</div>
          <div className="text-muted-foreground flex items-center justify-center gap-1">
            <Database className="w-3 h-3" />
            Memory
          </div>
        </div>
        <div className="text-center">
          <div className="text-foreground">{data.disk.toFixed(2)} GB</div>
          <div className="text-muted-foreground flex items-center justify-center gap-1">
            <Package className="w-3 h-3" />
            Disk
          </div>
        </div>
        <div className="text-center">
          <div className="text-foreground">1</div>
          <div className="text-muted-foreground flex items-center justify-center gap-1">
            <Network className="w-3 h-3" />
            Region
          </div>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="range"
          min="0"
          max="100"
          value={data.sliderValue}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #10b981 ${data.sliderValue / 2}%, #f59e0b ${data.sliderValue}%, #ef4444 100%)`,
          }}
          readOnly
        />
        <div className="text-right text-xs text-muted-foreground mt-1">
          {(data.sliderValue / 100).toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={getStatusVariant()}>{getStatusLabel()}</Badge>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
          alt="AWS"
          className="h-6 opacity-80"
        />
      </div>
    </div>
  );
};