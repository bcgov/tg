import React from 'react';
import { ViewMode } from '../../utils/const';

interface FloatingMenuProps {
  activeViewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode, event: React.MouseEvent) => void;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ activeViewMode, onToggleViewMode }) => {
  const viewModes = [
    { mode: ViewMode.Default, label: 'Technologies' },
    { mode: ViewMode.Integrations, label: 'Integrations' },
    { mode: ViewMode.Environments, label: 'Environments' },
  ];

  return (
    <div className="tg-fixed tg-bottom-8 tg-left-1/2 tg-transform tg--translate-x-1/2 tg-flex tg-bg-unit-light dark:tg-bg-unit-dark tg-rounded-full tg-shadow-lg">
      {viewModes.map((view, index) => (
        <button
          type="button"
          key={index}
          className={`tg-flex-1 tg-text-sm tg-text-label2-light dark:tg-text-label2-dark tg-font-medium tg-py-1 tg-px-3 tg-rounded-full tg-transition-all tg-duration-200 tg-ease-in-out
          ${activeViewMode === view.mode ? 'tg-bg-gray-200 dark:tg-bg-gray-700' : ''}
          focus:tg-outline-none hover:tg-bg-background-light dark:hover:tg-bg-stroke-dark`}
          onClick={event => onToggleViewMode(view.mode, event)}
        >
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FloatingMenu;
