import React from 'react';

const LegendOverlay: React.FC = () => {
  return (
    <div className="tg-absolute tg-m-5 tg-bottom-0 tg-left-0 tg-p-4 tg-rounded-lg tg-rounded-small tg-text-label-light dark:tg-text-label2-dark tg-bg-unit-light dark:tg-bg-unit-dark tg-text-sm tg-shadow-md tg-space-y-4">
      <div className="tg-flex tg-items-center tg-space-x-2">
        <div className="tg-w-4 tg-h-4 tg-rounded-full tg-bg-node-app-light dark:tg-bg-node-app-dark"></div>
        <span>Application</span>
      </div>

      <div className="tg-space-y-2">
        <div className="tg-flex tg-items-center tg-space-x-2">
          <div className="tg-w-4 tg-h-4 tg-bg-node-tech-light dark:tg-bg-node-tech-dark"></div>
          <span>Technology</span>
        </div>
        <div className="tg-ml-6 tg-space-y-2">
          <div className="tg-flex tg-items-center tg-space-x-2">
            <div className="tg-w-4 tg-h-4 tg-bg-node-app-peol-light dark:tg-bg-node-app-peol-dark"></div>
            <span>Past EOL</span>
          </div>
          <div className="tg-flex tg-items-center tg-space-x-2">
            <div className="tg-w-4 tg-h-4 tg-bg-node-app-neol-light dark:tg-bg-node-app-neol-dark"></div>
            <span>Near EOL</span>
          </div>
        </div>
        <div className="tg-flex tg-items-center tg-space-x-2">
          <div className="tg-w-4 tg-h-4 tg-bg-node-db-light dark:tg-bg-node-db-dark"></div>
          <span>Database Server</span>
        </div>
        <div className="tg-flex tg-items-center tg-space-x-2">
          <div className="tg-w-4 tg-h-4 tg-bg-node-server-light dark:tg-bg-node-server-dark"></div>
          <span>Server Appliance</span>
        </div>
      </div>
    </div>
  );
};

export default LegendOverlay;
