import React from 'react';
import { Network, ChevronDown, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useQuery } from '@tanstack/react-query';
import { fetchApps } from '@/api/mockApi';
import { AppsList } from './AppsList';

export const TopBar: React.FC = () => {
  const {
    selectedAppId,
    setMobilePanelOpen,
    isAppsOpen,
    setIsAppsOpen,
  } = useAppStore();

  const { data: apps } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
  });

  const selectedApp = apps?.find(app => app.id === selectedAppId);

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 relative">
      {/* Left section */}
      <div className="flex items-center gap-3 relative">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <Network className="w-5 h-5 text-primary-foreground" />
        </div>

        {/* App Selector Button */}
        <Button
          variant="secondary"
          className="flex items-center gap-2 px-3 py-1.5 relative z-10"
          onClick={() => setIsAppsOpen((v) => !v)}
        >
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-bold">
              {selectedApp?.name?.charAt(0).toUpperCase() || 'Q'}
            </span>
          </div>

          <span className="text-foreground text-sm font-medium">
            {selectedApp?.name || 'Select App'}
          </span>

          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isAppsOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>

        {/* Dropdown */}
        {isAppsOpen && <AppsList />}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobilePanelOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
