import React from 'react';
import { createPortal } from 'react-dom';
import { IoInformationCircleSharp } from 'react-icons/io5';
import { Node } from '../../types/NodeTypes';

const Modal: React.FC<{ onClose: () => void; node: Node }> = ({ onClose, node }) => {
  return createPortal(
    <div className="tg-fixed tg-inset-0 tg-flex tg-items-center tg-justify-center tg-bg-black tg-bg-opacity-50 tg-z-50">
      <div className="tg-relative tg-bg-white dark:tg-bg-gray-800 tg-rounded-lg tg-shadow-lg tg-max-w-2xl tg-w-full tg-max-h-[90vh] tg-overflow-hidden">
        {/* Header */}
        <div className="tg-flex tg-justify-between tg-items-center tg-p-4 tg-border-b tg-border-gray-200 dark:tg-border-gray-700">
          <h2 className="tg-text-xl tg-font-semibold tg-text-gray-900 dark:tg-text-white">
            Node Information
          </h2>
          <button
            type="button"
            className="tg-text-gray-500 dark:tg-text-gray-300 hover:tg-text-gray-700 dark:tg-hover"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="tg-p-4 tg-overflow-y-auto tg-max-h-[70vh] tg-space-y-6">
          {/* General Info */}
          <section>
            <h3 className="tg-flex tg-items-center tg-text-lg tg-font-medium tg-text-gray-800 dark:tg-text-gray-200 tg-mb-2">
              <IoInformationCircleSharp className="tg-mr-2" />
              General Info
            </h3>
            <div className="tg-space-y-1">
              <p className="tg-text-gray-700 dark:tg-text-gray-300">
                <strong>ID:</strong> {node.id}
              </p>
              <p className="tg-text-gray-700 dark:tg-text-gray-300">
                <strong>Type:</strong> {node.type}
              </p>
              {node.type === 'application' ? (
                <>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Product Owner:</strong> {node.productOwner || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Risk Level:</strong> {node.riskLevel || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Name: </strong> {node.appname || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Business Area: </strong> {node.businessarea || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Business SME: </strong> {node.businesssme || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Status: </strong> {node.applicationstatus ? 'Active' : 'Inactive'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Hosting Platform: </strong> {node.hostingplatform || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Identity Integrations: </strong> {node.identityintegrations || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Critical System: </strong> {node.criticalsystem ? 'Yes' : 'No'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>DEV URL: </strong> {node.devurl || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>PROD URL: </strong> {node.produrl || 'N/A'}
                  </p>
                  <p className="tg-text-gray-700 dark:tg-text-gray-300">
                    <strong>Description: </strong> {node.description || 'N/A'}
                  </p>
                </>
              ) : (
                <p className="tg-text-gray-700 dark:tg-text-gray-300">
                  <strong>EOL Date:</strong> {node.eolDate ? node.eolDate.toDateString() : 'N/A'}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
