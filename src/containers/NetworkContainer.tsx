import React, { useEffect, useState } from 'react';
import NetworkGraph from '../components/network-graph/NetworkGraph';
import OptionsOverlay from '../components/overlays/OptionsOverlay';
import SettingsOverlay from '../components/overlays/SettingsOverlay';
import './NetworkContainer.css';
import LegendOverlay from '../components/overlays/LegendOverlay';
import FloatingMenu from '../components/menu/FloatingMenuBar';
import { DEGREE_SEP, ViewMode } from '../utils/const';
import * as io5 from 'react-icons/io5';
import { IInputs } from '../generated/ManifestTypes';

interface GraphContainerProps {
  context: ComponentFramework.Context<IInputs>;
}

const GraphContainer: React.FC<GraphContainerProps> = ({ context }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [view, setView] = useState(ViewMode.Default); // Default view mode
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [degree] = useState(DEGREE_SEP);
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(false);
  const [showDecommissionedApps, setShowDecommissionedApps] = useState(false);

  const handleViewChange = (newView: ViewMode, event: React.MouseEvent) => {
    event.preventDefault();
    setView(newView as ViewMode);
    // Close the options overlay after selecting a view
    setOptionsVisible(false);
  };

  const handleToggleViewMode = (mode: ViewMode, event: React.MouseEvent) => {
    event.preventDefault();
    setView(mode);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleShowIsolatedNodes = () => {
    setShowIsolatedNodes(!showIsolatedNodes);
  };

  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Delay (300ms)

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  return (
    <div className="tg-bg-background-light dark:tg-bg-background-dark">
      <div className="tg-search-bar tg-m-5 tg-shadow-md tg-space-y-4 tg-absolute tg-left-0 tg-top-0 tg-bg-unit-light dark:tg-bg-unit-dark tg-">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={e => handleKeyDown(e)}
          placeholder="Search"
          className="tg-rounded-small tg-border-2 tg-border-stroke-light dark:tg-border-0 dark:tg-placeholder-label2-dark tg-bg-unit-light dark:tg-bg-stroke-dark"
        />
      </div>
      <NetworkGraph
        view={view}
        searchQuery={debouncedQuery}
        degree={degree}
        showIntegrationLinks={view === ViewMode.Integrations}
        showAppEnvironments={view === ViewMode.Environments}
        showIsolatedNodes={showIsolatedNodes}
        showDecommissionedApps={showDecommissionedApps}
        context={context}
      />
      <LegendOverlay activeViewMode={view} />
      <div className="tg-relative tg-bg-gray-50 dark:tg-bg-slate-900 tg-w-screen tg-h-screen tg-pattern">
        <nav className="tg-z-20 tg-flex tg-shrink-0 tg-grow-0 tg-justify-around tg-bg-white/50 tg-shadow-lg tg-backdrop-blur-lg dark:tg-bg-slate-800/50 tg-fixed tg-top-2/4 tg--translate-y-2/4 tg-right-6 tg-min-h-[auto] tg-min-w-[64px] tg-flex-col tg-rounded-lg">
          <a
            href="/"
            className="tg-flex tg-h-16 tg-w-16 tg-flex-col tg-items-center tg-justify-center tg-gap-1 dark:tg-text-gray-400"
          >
            <io5.IoHomeSharp size={21} />
            <small className="tg-text-xs tg-font-medium">Home</small>
          </a>
          <hr className="dark:tg-border-gray-700/60" />
          <button
            onClick={() => setOptionsVisible(true)}
            className="tg-flex tg-aspect-square tg-min-h-[32px] tg-w-16 tg-flex-col tg-items-center tg-justify-center tg-gap-1 tg-rounded-md tg-p-1.5 tg-text-gray-700 hover:tg-bg-gray-100 dark:tg-text-gray-400 dark:hover:tg-bg-slate-800"
          >
            <io5.IoOptionsSharp size={21} />
            <small className="tg-text-center tg-text-xs tg-font-medium">Options</small>
          </button>
          <button
            onClick={() => setSettingsVisible(true)}
            className="tg-flex tg-aspect-square tg-min-h-[32px] tg-w-16 tg-flex-col tg-items-center tg-justify-center tg-gap-1 tg-rounded-md tg-p-1.5 tg-text-gray-700 hover:tg-bg-gray-100 dark:tg-text-gray-400 dark:hover:tg-bg-slate-800"
          >
            <io5.IoSettingsSharp size={21} />
            <small className="tg-text-center tg-text-xs tg-font-medium">Settings</small>
          </button>
        </nav>
      </div>
      {settingsVisible && (
        <SettingsOverlay
          onClose={() => setSettingsVisible(false)}
          onHandleIsolatedNodes={handleShowIsolatedNodes}
          showIsolatedNode={showIsolatedNodes}
          onHandleDecommissionedApps={() => setShowDecommissionedApps(!showDecommissionedApps)}
          showDecommissionedApps={showDecommissionedApps}
        />
      )}
      {optionsVisible && (
        <OptionsOverlay onClose={() => setOptionsVisible(false)} onChangeView={handleViewChange} />
      )}
      <FloatingMenu
        activeViewMode={view}
        onToggleViewMode={handleToggleViewMode} // Handle toggling between view modes
      />
    </div>
  );
};

export default GraphContainer;
