import React from 'react';
import { Github, Gitlab, Database, Code, Package, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LeftRail: React.FC = () => {
  const icons = [
    { Icon: Github, color: 'text-muted-foreground' },
    { Icon: Gitlab, color: 'text-orange-500' },
    { Icon: Database, color: 'text-red-500' },
    { Icon: Code, color: 'text-green-500' },
    { Icon: Package, color: 'text-yellow-500' },
    { Icon: Network, color: 'text-blue-500' },
  ];

  return (
    <aside className="hidden lg:flex w-16 flex-col items-center">
      {/* Floating icon stack */}
      <div
        className="
          mt-auto mb-auto
          flex flex-col items-center gap-4
          rounded-xl
          bg-background
          border border-border
          p-2
          shadow-sm
          -translate-y-2
        "
      >
        {icons.map(({ Icon, color }, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className="w-10 h-10"
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </Button>
        ))}
      </div>
    </aside>
  );
};
