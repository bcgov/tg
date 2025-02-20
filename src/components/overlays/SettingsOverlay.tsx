import React, { useRef } from 'react';
import { IoSunny, IoMoon, IoCloseSharp } from 'react-icons/io5';

interface SettingsOverlayProps {
  onClose: () => void;
  showIsolatedNode: boolean;
  onHandleIsolatedNodes: () => void;
  onHandleDecommissionedApps: () => void;
  showDecommissionedApps: boolean;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  onClose,
  showIsolatedNode,
  onHandleIsolatedNodes,
  onHandleDecommissionedApps,
  showDecommissionedApps,
}) => {
  const [dark, setDark] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const darkModeHandler = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('tg-dark');
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="tg-fixed tg-inset-0 tg-bg-gray-900 tg-bg-opacity-75 tg-flex tg-items-center tg-justify-center"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="tg-bg-white dark:tg-bg-gray-800 tg-rounded-lg tg-p-6 tg-w-80 tg-shadow-lg tg-relative"
      >
        <div className="tg-flex tg-justify-between tg-items-center tg-mb-4">
          <h2 className="tg-text-xl tg-font-semibold tg-text-gray-900 dark:tg-text-white">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="tg-text-gray-500 dark:tg-text-gray-300 hover:tg-text-gray-700 dark:hover:tg-text-gray-500"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="tg-flex tg-items-center tg-justify-between tg-mb-4">
          <label htmlFor="isolatedNodesToggle" className="tg-text-gray-700 dark:tg-text-gray-300">
            Hide Isolated Nodes
          </label>
          <input
            id="isolatedNodesToggle"
            type="checkbox"
            className="tg-w-5 tg-h-5 tg-text-blue-600 tg-rounded-md tg-focus:ring-2 tg-focus:ring-blue-400 dark:tg-bg-gray-600"
            checked={showIsolatedNode}
            onChange={onHandleIsolatedNodes}
          />
        </div>

        <div className="tg-flex tg-items-center tg-justify-between tg-mb-4">
          <label htmlFor="isolatedNodesToggle" className="tg-text-gray-700 dark:tg-text-gray-300">
            Show Decommissioned Apps
          </label>
          <input
            id="decommissionedAppsToggle"
            type="checkbox"
            className="tg-w-5 tg-h-5 tg-text-blue-600 tg-rounded-md tg-focus:ring-2 tg-focus:ring-blue-400 dark:tg-bg-gray-600"
            checked={showDecommissionedApps}
            onChange={onHandleDecommissionedApps}
          />
        </div>

        <div className="tg-flex tg-items-center tg-justify-between tg-mb-4">
          <span className="tg-text-gray-700 dark:tg-text-gray-300">Dark Mode</span>
          <button
            type="button"
            onClick={darkModeHandler}
            className="tg-flex tg-items-center tg-justify-center tg-p-2 tg-w-12 tg-h-12 tg-rounded-full tg-bg-gray-200 dark:tg-bg-gray-700 hover:tg-bg-gray-300 dark:hover:tg-bg-gray-600 tg-focus:outline-none"
          >
            {dark ? (
              <IoSunny className="tg-text-yellow-500" />
            ) : (
              <IoMoon className="tg-text-gray-900 dark:tg-text-gray-300" />
            )}
          </button>
        </div>

        <div className="tg-flex tg-justify-end tg-mt-6">
          <button
            type="button"
            onClick={onClose}
            className="tg-px-4 tg-py-2 tg-bg-blue-600 tg-text-white tg-rounded-md hover:tg-bg-blue-700 tg-focus:ring-2 tg-focus:ring-blue-400 tg-focus:ring-opacity-75"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
