"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'participants', label: 'Participantes', icon: '👥' },
    { id: 'expenses', label: 'Despesas', icon: '💰' },
    { id: 'shops', label: 'Lojas', icon: '🏪' },
    { id: 'votacao', label: 'Votação', icon: '🏆' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className={cn(
            "flex-1 justify-start gap-2 h-10",
            activeTab === tab.id 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </Button>
      ))}
    </div>
  );
}