import React, { useEffect, useState } from 'react';
import NetworkGraph from '../components/network-graph/NetworkGraph';
import OptionsOverlay from '../components/overlays/OptionsOverlay';
import SettingsOverlay from '../components/overlays/SettingsOverlay';
import './NetworkContainer.css';
import LegendOverlay from '../components/overlays/LegendOverlay';
import FloatingMenu from '../components/menu/FloatingMenuBar';
import { ViewMode } from '../utils/const';
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
  const [degree] = useState(2);
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(false);

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
    <div className="bg-background-light dark:bg-background-dark">
      <div className="search-bar m-5 shadow-md space-y-4 absolute left-0 top-0 bg-unit-light dark:bg-unit-dark ">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={e => handleKeyDown(e)}
          placeholder="Search"
          className="rounded-small border-2 border-stroke-light dark:border-0 dark:placeholder-label2-dark bg-unit-light dark:bg-stroke-dark"
        />
      </div>
      <NetworkGraph
        view={view}
        searchQuery={debouncedQuery}
        degree={degree}
        showIntegrationLinks={view === ViewMode.Integrations}
        showAppEnvironments={view === ViewMode.Environments}
        showIsolatedNodes={showIsolatedNodes}
        context={context}
      />
      <LegendOverlay />
      <div className="relative bg-gray-50 dark:bg-slate-900 w-screen h-screen pattern">
        <nav className="z-20 flex shrink-0 grow-0 justify-around bg-white/50 shadow-lg backdrop-blur-lg dark:bg-slate-800/50 fixed top-2/4 -translate-y-2/4 right-6 min-h-[auto] min-w-[64px] flex-col rounded-lg">
          <a
            href="/"
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 dark:text-gray-400"
          >
            <io5.IoHomeSharp size={21} />
            <small className="text-xs font-medium">Home</small>
          </a>
          <hr className="dark:border-gray-700/60" />
          <button
            onClick={() => setOptionsVisible(true)}
            className="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
          >
            <io5.IoOptionsSharp size={21} />
            <small className="text-center text-xs font-medium">Options</small>
          </button>
          <button
            onClick={() => setSettingsVisible(true)}
            className="flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
          >
            <io5.IoSettingsSharp size={21} />
            <small className="text-center text-xs font-medium">Settings</small>
          </button>
        </nav>
      </div>
      {settingsVisible && (
        <SettingsOverlay
          onClose={() => setSettingsVisible(false)}
          onHandleIsolatedNodes={handleShowIsolatedNodes}
          showIsolatedNode={showIsolatedNodes}
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
