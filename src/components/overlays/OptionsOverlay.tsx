import React, { useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface OptionsOverlayProps {
  onClose: () => void;
  onChangeView: (view: string, event: React.MouseEvent) => void;
}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({
  onClose,
  onChangeView,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
            Options
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={(event) => onChangeView("planar", event)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Planar View
          </button>
          <button
            type="button"
            onClick={(event) => onChangeView("cluster", event)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Louvain Cluster
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsOverlay;
