/**
 * NodesLink.ts
 * - Maps data from the API onto distinct node objects
 * - Creates Node and Link objects without describing how they should look
 */

import { Node, Link } from "../utils/NodeTypes";

// Function to process nodes from applications and technologies
export const processNodesAndLinks = (
  applications: any[],
  technologies: any[],
  applicationTechnologies: any[],
  applicationIntegrations: any[],
  showAppIntegrations: boolean,
  showAppEnvironments: boolean,
  appHostingServers: any[]
) => {
  const nodesMap: { [key: string]: Node } = {};

  applications.forEach((app) => {
    nodesMap[app.cr57a_appshortcode] = {
      id: app.cr57a_appshortcode,
      type: "application",
      productOwner: app.cr57a_productowner,
      riskLevel: app.cr57a_risklevel ? app.cr57a_risklevel % 10 : null,
    };
  });

  technologies.forEach((tech) => {
    nodesMap[tech.cr57a_technologyname] = {
      id: tech.cr57a_technologyname,
      type: "technology",
      eolDate: tech.cr57a_eoldate ? new Date(tech.cr57a_eoldate) : null,
    };
  });

  const appTechLinks: Link[] = applicationTechnologies.map((appTech) => ({
    source:
      applications.find(
        (app) => app.cr57a_appscatalogueid === appTech._cr57a_appshortcode_value
      )?.cr57a_appshortcode || "",
    target:
      technologies.find(
        (tech) => tech.cr57a_technologiesid === appTech._cr57a_technology_value
      )?.cr57a_technologyname || "",
  }));

  // Handle integration links if needed
  const integrationLinks: Link[] = [];
  const commonComponentLinks: Link[] = [];

  if (showAppIntegrations) {
    applicationIntegrations.forEach((integration) => {
      const targetApp = applications.find(
        (app) =>
          app.cr57a_appscatalogueid === integration._cr57a_appshortcode_value
      )?.cr57a_appshortcode;
      const upstreamApp = applications.find(
        (app) =>
          app.cr57a_appscatalogueid ===
          integration._cr57a_upstreamapplication_value
      )?.cr57a_appshortcode;

      if (upstreamApp && targetApp) {
        integrationLinks.push({ source: upstreamApp, target: targetApp });
      }

      if (integration.cr57a_commoncomponent) {
        const commonComponentName =
          integration[
            "cr57a_commoncomponent@OData.Community.Display.V1.FormattedValue"
          ];
        if (!nodesMap[commonComponentName]) {
          nodesMap[commonComponentName] = {
            id: commonComponentName,
            type: "common-component",
          };
        }

        if (targetApp) {
          commonComponentLinks.push({
            source: targetApp,
            target: commonComponentName,
          });
        }
      }
    });
  }

  // Prepare Links from appEnvironmentLinks if toggle is enabled
  const appEnvironmentLinks: Link[] = [];

  if (showAppEnvironments) {
    nodesMap["OpenShift"] = {
      id: "OpenShift",
      type: "openshift",
    };

    if (!appHostingServers || !appHostingServers.length) {
      return;
    }

    // Add new nodes for server appliances and database servers
    appHostingServers.forEach((hostingInfo) => {
      const appNode = applications.find(
        (app) =>
          app.cr57a_appscatalogueid === hostingInfo._cr57a_appshortcode_value
      );

      if (!appNode) return;

      // Add a node for the Database Server
      if (hostingInfo._cr57a_databaseserver_value) {
        const dbServerName =
          hostingInfo[
            "_cr57a_databaseserver_value@OData.Community.Display.V1.FormattedValue"
          ]?.split(".")[0];
        if (!nodesMap[dbServerName]) {
          nodesMap[dbServerName] = {
            id: dbServerName,
            type: "database-server",
          };
        }
        // Link the app to its database server
        appEnvironmentLinks.push({
          source: appNode.cr57a_appshortcode,
          target: dbServerName,
        });
      }

      // Add a node for the Server Appliance
      if (hostingInfo._cr57a_serverappliance_value) {
        const serverApplianceName =
          hostingInfo[
            "_cr57a_serverappliance_value@OData.Community.Display.V1.FormattedValue"
          ]?.split(".")[0];
        if (!nodesMap[serverApplianceName]) {
          nodesMap[serverApplianceName] = {
            id: serverApplianceName,
            type: "server-appliance",
          };
        }
        // Link the app to its server appliance
        appEnvironmentLinks.push({
          source: appNode.cr57a_appshortcode,
          target: serverApplianceName,
        });
      }

      // If OpenShift namespace is present, link the app to OpenShift
      if (hostingInfo.cr57a_openshiftnamespace) {
        appEnvironmentLinks.push({
          source: appNode.cr57a_appshortcode,
          target: "OpenShift",
        });
      }
    });
  }

  return {
    allNodes: Object.values(nodesMap),
    appTechLinks,
    integrationLinks,
    commonComponentLinks,
    appEnvironmentLinks
  };
};
