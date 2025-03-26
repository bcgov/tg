/**
 * NodesLink.ts
 * - Maps data from the API onto distinct node objects
 * - Creates Node and Link objects without describing how they should look
 */

import { Node, Link } from '../types/NodeTypes';
import {
  AppEnvironments,
  Application,
  ApplicationIntegrations,
  ApplicationTechnology,
  Technology,
  TechnologyVersion,
} from '../types/ResponseTypes';

// Function to process nodes from applications and technologies
export const processNodesAndLinks = (
  applications: Application[],
  technologies: Technology[],
  techVersions: TechnologyVersion[],
  applicationTechnologies: ApplicationTechnology[],
  applicationIntegrations: ApplicationIntegrations[],
  showAppIntegrations: boolean,
  showAppEnvironments: boolean,
  appHostingServers: AppEnvironments[],
) => {
  const nodesMap: { [key: string]: Node } = {};

  applications.forEach(app => {
    nodesMap[app.cr57a_appshortcode] = {
      id: app.cr57a_appshortcode,
      paId: app.cr57a_appscatalogueid,
      type: 'application',
      productOwner: app.cr57a_productowner,
      riskLevel: app.cr57a_risklevel ? app.cr57a_risklevel % 10 : null,
      appname: app.cr57a_appname,
      businessarea: app.cr57a_businessarea,
      businesssme: app.cr57a_businesssme,
      applicationstatus: app.cr57a_applicationstatus,
      hostingplatform: app['cr57a_hostingplatform@OData.Community.Display.V1.FormattedValue'],
      identityintegrations:
        app['cr57a_identityintegrations@OData.Community.Display.V1.FormattedValue'],
      criticalsystem: app.cr57a_criticalsystem,
      devurl: app.cr57a_devurl,
      produrl: app.cr57a_produrl,
      description: app.cr57a_description,
    };
  });

  // Create nodes for each technology and its versions
  technologies.forEach(tech => {
    nodesMap[tech.cr57a_technologyname] = {
      id: tech.cr57a_technologyname,
      paId: tech.cr57a_technologiesid,
      type: 'technology',
      eolDate: tech.cr57a_eoldate ? new Date(tech.cr57a_eoldate) : null,
    };
  });

  // Create nodes for each version of the technology
  techVersions.forEach(version => {
    const technology = technologies.find(
      tech => tech.cr57a_technologiesid === version._imb_technology_value,
    );

    if (technology) {
      const versionedId = `${technology.cr57a_technologyname} ${version.imb_version}`;
      nodesMap[versionedId] = {
        id: versionedId,
        type: 'technology',
        eolDate: version.imb_eoldate ? new Date(version.imb_eoldate) : null,
      };
    }
  });

  // Process application-technologies relationships to link applications to specific technology versions
  const appTechLinks: Link[] = applicationTechnologies
    .map(appTech => {
      const sourceApp = applications.find(
        app => app.cr57a_appscatalogueid === appTech._cr57a_appshortcode_value,
      );
      const targetVersion = techVersions.find(
        version => version.imb_technologyversionid === appTech._imb_technologyversion_value,
      );

      // Ensure `source` and `target` are strings, defaulting to empty string if undefined
      const source = String(sourceApp?.cr57a_appshortcode || '');
      const target = targetVersion
        ? `${String(
            technologies.find(
              tech => tech.cr57a_technologiesid === targetVersion._imb_technology_value,
            )?.cr57a_technologyname || '',
          )} ${targetVersion.imb_version}`
        : String(
            technologies.find(tech => tech.cr57a_technologiesid === appTech._cr57a_technology_value)
              ?.cr57a_technologyname || '',
          );

      return source && target ? ({ source, target } as Link) : null;
    })
    .filter((link): link is Link => link !== null);

  // Handle integration links if needed
  const integrationLinks: Link[] = [];
  const commonComponentLinks: Link[] = [];

  if (showAppIntegrations) {
    applicationIntegrations.forEach(integration => {
      const targetApp = applications.find(
        app => app.cr57a_appscatalogueid === integration._cr57a_appshortcode_value,
      )?.cr57a_appshortcode;
      const upstreamApp = applications.find(
        app => app.cr57a_appscatalogueid === integration._cr57a_upstreamapplication_value,
      )?.cr57a_appshortcode;

      if (upstreamApp && targetApp) {
        integrationLinks.push({ source: upstreamApp, target: targetApp });
      }

      if (integration.cr57a_commoncomponent) {
        const commonComponentName =
          integration['cr57a_commoncomponent@OData.Community.Display.V1.FormattedValue'];
        if (!nodesMap[commonComponentName]) {
          nodesMap[commonComponentName] = {
            id: commonComponentName,
            type: 'common-component',
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
    nodesMap['OpenShift'] = {
      id: 'OpenShift',
      type: 'openshift',
    };

    if (!appHostingServers || !appHostingServers.length) {
      return;
    }

    // Add new nodes for server appliances and database servers
    appHostingServers.forEach(hostingInfo => {
      const appNode = applications.find(
        app => app.cr57a_appscatalogueid === hostingInfo._cr57a_appshortcode_value,
      );

      if (!appNode) return;

      // Add a node for the Database Server
      if (hostingInfo._cr57a_databaseserver_value) {
        const dbServerName =
          hostingInfo[
            '_cr57a_databaseserver_value@OData.Community.Display.V1.FormattedValue'
          ]?.split('.')[0];
        if (!nodesMap[dbServerName]) {
          nodesMap[dbServerName] = {
            paId: hostingInfo._cr57a_databaseserver_value,
            id: dbServerName,
            type: 'database-server',
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
            '_cr57a_serverappliance_value@OData.Community.Display.V1.FormattedValue'
          ]?.split('.')[0];
        if (!nodesMap[serverApplianceName]) {
          nodesMap[serverApplianceName] = {
            paId: hostingInfo._cr57a_serverappliance_value,
            id: serverApplianceName,
            type: 'server-appliance',
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
          target: 'OpenShift',
        });
      }
    });
  }

  return {
    allNodes: Object.values(nodesMap),
    appTechLinks,
    integrationLinks,
    commonComponentLinks,
    appEnvironmentLinks,
  };
};
