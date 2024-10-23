import React, { useRef } from "react";
import { IoSunny, IoMoon, IoCloseSharp } from "react-icons/io5";

interface SettingsOverlayProps {
  onClose: () => void;
  showIsolatedNode: boolean;
  onHandleIsolatedNodes: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  onClose,
  showIsolatedNode,
  onHandleIsolatedNodes,
}) => {
  const [dark, setDark] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const darkModeHandler = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <label
            htmlFor="isolatedNodesToggle"
            className="text-gray-700 dark:text-gray-300"
          >
            Hide Isolated Nodes
          </label>
          <input
            id="isolatedNodesToggle"
            type="checkbox"
            className="w-5 h-5 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-400 dark:bg-gray-600"
            checked={showIsolatedNode}
            onChange={onHandleIsolatedNodes}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <button
            type="button"
            onClick={darkModeHandler}
            className="flex items-center justify-center p-2 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
          >
            {dark ? (
              <IoSunny className="text-yellow-500" />
            ) : (
              <IoMoon className="text-gray-900 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
