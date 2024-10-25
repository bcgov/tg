/**
 * NodesLinkAppearance.ts
 * - Describes how nodes and links should look for each category
 */

import { Node, Link } from '../utils/NodeTypes';
import { DATETIME } from '../utils/const';
import * as d3 from 'd3';

/**
 * Styles for nodes based on their type and properties
 */
export const applyNodeStyles = (
  nodesSelection: d3.Selection<any, Node, any, any>,
) => {
  // Append `rect` for technology nodes
  nodesSelection
    .filter(d => d.type === 'technology')
    .append('rect')
    .attr('class', 'node-rect')
    .attr('class', 'fill-node-tech-light dark:fill-node-tech-dark')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', -10)
    .attr('y', -10)
    .attr('class', d => {
      if (d.eolDate && d.eolDate < DATETIME.TODAY) {
        return 'fill-node-app-peol-light dark:fill-node-app-peol-dark'; // Past d.eolDate
      } else if (
        d.eolDate &&
        d.eolDate >= DATETIME.TODAY &&
        d.eolDate <= DATETIME.EOL_NEAR
      ) {
        return 'fill-node-app-neol-dark'; // Nearing eolDate
      } else {
        return 'fill-node-tech-light dark:fill-node-tech-dark'; // Default color
      }
    });

  // Append `circle` for non-technology nodes
  nodesSelection
    .filter(d => d.type !== 'technology')
    .append('circle')
    .attr('class', 'node-circle')
    .attr('class', 'fill-node-app-light dark:fill-node-app-dark')
    .attr('r', 10);

  // Custom appearance for specific node types
  nodesSelection
    .filter(d => d.type === 'common-component')
    .append('rect')
    .attr('class', 'node-rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', -10)
    .attr('y', -10)
    .attr('fill', '#f04a55');

  nodesSelection
    .filter(d => d.type === 'database-server')
    .append('rect')
    .attr('class', 'node-rect')
    .attr('class', 'fill-node-db-light dark:fill-node-db-dark')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', -10)
    .attr('y', -10);

  nodesSelection
    .filter(d => d.type === 'server-appliance')
    .append('rect')
    .attr('class', 'node-rect')
    .attr('class', 'fill-node-server-light dark:fill-node-server-dark')
    .attr('width', 20)
    .attr('height', 20)
    .attr('x', -10)
    .attr('y', -10);

  nodesSelection
    .filter(d => d.type === 'openshift')
    .append('circle')
    .attr('class', 'node-circle')
    .attr('r', 15)
    .attr('fill', '#e74c3c'); // Custom color for OpenShift
};

/**
 * Styles for node labels, adjusting the font size and color for readability
 */
export const applyLabelStyles = (
  labelsSelection: d3.Selection<any, Node, any, any>,
) => {
  labelsSelection
    .attr('class', 'fill-label-light dark:fill-label-dark')
    .attr('dy', -3)
    .text(d => d.id);
};

/**
 * Styles for links between nodes, including integration links with arrowheads
 */
export const applyLinkStyles = (
  linksSelection: d3.Selection<any, Link, any, any>,
  directedLinksSelection: d3.Selection<any, Link, any, any>,
) => {
  // Styling for regular links
  linksSelection
    .attr('class', 'link stroke-link-light dark:stroke-link-dark')
    .attr('stroke-width', 1);

  // Styling for directed links (integration links with arrowheads)
  directedLinksSelection
    .attr('stroke', '#999')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');
};
