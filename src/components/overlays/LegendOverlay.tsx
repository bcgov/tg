import React from 'react';

const LegendOverlay: React.FC = () => {
  return (
    <div className="absolute m-5 bottom-0 left-0 p-4 rounded-lg rounded-small text-label-light dark:text-label2-dark bg-unit-light dark:bg-unit-dark text-sm shadow-md space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-node-app-light dark:bg-node-app-dark"></div>
        <span>Application</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-node-tech-light dark:bg-node-tech-dark"></div>
          <span>Technology</span>
        </div>
        <div className="ml-6 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-node-app-peol-light dark:bg-node-app-peol-dark"></div>
            <span>Past EOL</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-node-app-neol-light dark:bg-node-app-neol-dark"></div>
            <span>Near EOL</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-node-server-light dark:bg-node-server-dark"></div>
          <span>Database Server</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-node-db-light dark:bg-node-db-dark"></div>
          <span>Server Appliance</span>
        </div>
      </div>
    </div>
  );
};

export default LegendOverlay;
