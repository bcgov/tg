import React from 'react';
import { ViewMode } from '../../utils/const';

interface FloatingMenuProps {
  activeViewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode, event: React.MouseEvent) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({
  activeViewMode,
  onToggleViewMode,
}) => {
  const viewModes = [
    { mode: ViewMode.Default, label: 'Technologies' },
    { mode: ViewMode.Integrations, label: 'Integrations' },
    { mode: ViewMode.Environments, label: 'Environments' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex bg-unit-light dark:bg-unit-dark rounded-full shadow-lg">
      {viewModes.map((view, index) => (
        <button
          type="button"
          key={index}
          className={`flex-1 text-sm text-label2-light dark:text-label2-dark font-medium py-1 px-3 rounded-full transition-all duration-200 ease-in-out
          ${activeViewMode === view.mode ? 'bg-gray-200 dark:bg-gray-700' : ''}
          focus:outline-none hover:bg-background-light dark:hover:bg-stroke-dark`}
          onClick={event => onToggleViewMode(view.mode, event)}
        >
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FloatingMenu;
