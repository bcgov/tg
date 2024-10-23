import React from "react";
import { createPortal } from "react-dom";
import { IoInformationCircleSharp } from "react-icons/io5";

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

const Modal: React.FC<{ onClose: () => void; node: Node }> = ({
  onClose,
  node,
}) => {
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Node Information
          </h2>
          <button
            type="button"
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <section className="mb-4">
          <h3 className="flex items-center text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
            <IoInformationCircleSharp className="mr-2" />
            General Info
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>ID:</strong> {node.id}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Type:</strong> {node.type}
          </p>
          {node.type === "technology" ? (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>EOL Date:</strong>{" "}
              {node.eolDate ? node.eolDate.toDateString() : "N/A"}
            </p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Product Owner:</strong> {node.productOwner || "N/A"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Risk Level:</strong> {node.riskLevel || "N/A"}
              </p>
            </>
          )}
        </section>

        {node.openshiftInfo && (
          <section className="mb-4">
            <div className="flex items-center mb-2">
              <img
                src="https://w7.pngwing.com/pngs/187/377/png-transparent-openshift-hd-logo.png"
                alt="OpenShift"
                className="w-5 h-5 mr-2"
              />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                OpenShift Information
              </h3>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {node.openshiftInfo}
            </pre>
          </section>
        )}

        {node.githubInfo && (
          <section>
            <div className="flex items-center mb-2">
              <img
                src="https://github.githubassets.com/favicons/favicon.svg"
                alt="GitHub"
                className="w-5 h-5 mr-2"
              />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                GitHub Information
              </h3>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {node.githubInfo}
            </pre>
          </section>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
