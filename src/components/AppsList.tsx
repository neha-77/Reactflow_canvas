import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Code, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { fetchApps } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AppsList: React.FC = () => {
  const {
    selectedAppId,
    setSelectedAppId,
    isAppsOpen,
    setIsAppsOpen,
  } = useAppStore();

  const { data: apps, isLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    enabled: isAppsOpen, // fetch only when open
  });

  if (!isAppsOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-64 z-50 bg-background border border-border rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Applications</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsAppsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Input placeholder="Search..." className="mb-3" />

        {/* Content */}
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-secondary rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {apps?.map((app) => (
              <Button
                key={app.id}
                variant={selectedAppId === app.id ? 'secondary' : 'ghost'}
                className="w-full justify-between"
                onClick={() => {
                  setSelectedAppId(app.id);
                  setIsAppsOpen(false); // auto-close on select
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm">{app.name}</span>
                </div>
                <span className="text-muted-foreground">›</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
