import React, { useRef } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

interface OptionsOverlayProps {
  onClose: () => void;
  onChangeView: (view: string, event: React.MouseEvent) => void;
}

const OptionsOverlay: React.FC<OptionsOverlayProps> = ({ onClose, onChangeView }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
            Options
          </h2>
          <button
            onClick={onClose}
            className="tg-text-gray-500 dark:tg-text-gray-300 hover:tg-text-gray-700 dark:hover:tg-text-gray-500"
          >
            <IoCloseSharp />
          </button>
        </div>

        <div className="tg-flex tg-flex-col tg-gap-2">
          <button
            type="button"
            onClick={event => onChangeView('planar', event)}
            className="tg-w-full tg-px-4 tg-py-2 tg-bg-blue-600 tg-text-white tg-rounded-md hover:tg-bg-blue-700 tg-focus:ring-2 tg-focus:ring-blue-400 tg-focus:ring-opacity-75"
          >
            Planar View
          </button>
          <button
            type="button"
            onClick={event => onChangeView('cluster', event)}
            className="tg-w-full tg-px-4 tg-py-2 tg-bg-blue-600 tg-text-white tg-rounded-md hover:tg-bg-blue-700 tg-focus:ring-2 tg-focus:ring-blue-400 tg-focus:ring-opacity-75"
          >
            Louvain Cluster
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsOverlay;
