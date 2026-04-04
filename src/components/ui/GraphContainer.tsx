import React from 'react';
import { Card } from './Card';
import { Maximize2, Minimize2, Settings, Download } from 'lucide-react';

interface GraphContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  onDownload?: () => void;
}

export const GraphContainer: React.FC<GraphContainerProps> = ({ 
  title, 
  description, 
  children,
  onDownload
}) => {
  return (
    <Card className="flex flex-col h-full border-gray-800/50 bg-black/60 shadow-2xl relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between bg-black/40 backdrop-blur-sm">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {title}
            </h3>
            {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
              <Settings className="w-4 h-4" />
            </button>
            {onDownload && (
              <button 
                onClick={onDownload}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 relative min-h-[400px]">
          {children}
        </div>
      </div>
    </Card>
  );
};
