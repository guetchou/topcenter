
import React from 'react';
import { adminLinks } from './AdminNavLinks';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import PocketBaseStatus from '@/components/PocketBaseStatus';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Card className="h-screen w-64 border-r rounded-none fixed left-0 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Administration</h2>
      </div>
      
      <PocketBaseStatus />
      
      <ScrollArea className="flex-1 mt-6">
        <div className="space-y-1">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
              }
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-auto pt-4 border-t">
        <div className="text-xs text-muted-foreground">
          TopCenter v1.0.0
        </div>
      </div>
    </Card>
  );
};

export default Sidebar;
