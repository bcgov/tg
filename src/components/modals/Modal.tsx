import React from 'react';
import { createPortal } from 'react-dom';
import { IoInformationCircleSharp } from 'react-icons/io5';

interface Node {
  id: string;
  type: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  productOwner?: string | null;
  riskLevel?: number | null;
  eolDate?: Date | null;
  appserver?: string | null;
  storage?: string | null;
  openshiftInfo?: string | null;
  githubInfo?: string | null;
}

const Modal: React.FC<{ onClose: () => void; node: Node }> = ({ onClose, node }) => {
  // MOCKUP PURPOSE ONLY. REMOVE
  const mock = {
    openshiftInfo: `Project: my-project
Namespace: dev-namespace
Deployment Status: Active
Pod Count: 3`,
    githubInfo: `Repository: my-app-repo
Stars: 34
Last Commit: September 10, 2024
Open Issues: 5
Pull Requests: 2 Open, 10 Merged
Actions: Passed`,
  };
  node.openshiftInfo = mock.openshiftInfo;
  node.githubInfo = mock.githubInfo;
  // END OF MOCKUP PURPOSE

  return createPortal(
    <div className="tg-fixed tg-inset-0 tg-flex tg-items-center tg-justify-center tg-bg-black tg-bg-opacity-50 tg-z-50">
      <div className="tg-bg-white dark:tg-bg-gray-800 tg-p-6 tg-rounded-lg tg-shadow-lg tg-max-w-lg tg-w-full">
        <div className="tg-flex tg-justify-between tg-items-center tg-mb-4">
          <h2 className="tg-text-xl tg-font-semibold tg-text-gray-900 dark:tg-text-white">
            Node Information
          </h2>
          <button
            type="button"
            className="tg-text-gray-500 dark:tg-text-gray-300 hover:tg-text-gray-700 dark:hover:tg-text-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <section className="tg-mb-4">
          <h3 className="tg-flex tg-items-center tg-text-lg tg-font-medium tg-text-gray-800 dark:tg-text-gray-200 tg-mb-2">
            <IoInformationCircleSharp className="tg-mr-2" />
            General Info
          </h3>
          <p className="tg-text-gray-700 dark:tg-text-gray-300">
            <strong>ID:</strong> {node.id}
          </p>
          <p className="tg-text-gray-700 dark:tg-text-gray-300">
            <strong>Type:</strong> {node.type}
          </p>
          {node.type === 'technology' ? (
            <p className="tg-text-gray-700 dark:tg-text-gray-300">
              <strong>EOL Date:</strong> {node.eolDate ? node.eolDate.toDateString() : 'N/A'}
            </p>
          ) : (
            <>
              <p className="tg-text-gray-700 dark:tg-text-gray-300">
                <strong>Product Owner:</strong> {node.productOwner || 'N/A'}
              </p>
              <p className="tg-text-gray-700 dark:tg-text-gray-300">
                <strong>Risk Level:</strong> {node.riskLevel || 'N/A'}
              </p>
            </>
          )}
        </section>

        {node.openshiftInfo && (
          <section className="tg-mb-4">
            <div className="tg-flex tg-items-center tg-mb-2">
              <img
                src="https://w7.pngwing.com/pngs/187/377/png-transparent-openshift-hd-logo.png"
                alt="OpenShift"
                className="tg-w-5 tg-h-5 tg-mr-2"
              />
              <h3 className="tg-text-lg tg-font-medium tg-text-gray-800 dark:tg-text-gray-200">
                OpenShift Information
              </h3>
            </div>
            <pre className="tg-bg-gray-100 dark:tg-bg-gray-700 tg-p-3 tg-rounded-md tg-text-sm tg-text-gray-800 dark:tg-text-gray-200 tg-whitespace-pre-wrap">
              {node.openshiftInfo}
            </pre>
          </section>
        )}

        {node.githubInfo && (
          <section>
            <div className="tg-flex tg-items-center tg-mb-2">
              <img
                src="https://github.githubassets.com/favicons/favicon.svg"
                alt="GitHub"
                className="tg-w-5 tg-h-5 tg-mr-2"
              />
              <h3 className="tg-text-lg tg-font-medium tg-text-gray-800 dark:tg-text-gray-200">
                GitHub Information
              </h3>
            </div>
            <pre className="tg-bg-gray-100 dark:tg-bg-gray-700 tg-p-3 tg-rounded-md tg-text-sm tg-text-gray-800 dark:tg-text-gray-200 tg-whitespace-pre-wrap">
              {node.githubInfo}
            </pre>
          </section>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
