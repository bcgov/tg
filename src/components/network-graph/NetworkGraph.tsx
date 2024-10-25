import React, { useRef, useEffect, useState, Suspense } from 'react';
import * as d3 from 'd3';
import useFetchData from '../../hooks/useFetchData';
import {
  setupSimulation,
  updateSimulationForView,
  applySearch,
  VIEW_OPTIONS,
} from './Simulations';
import { Node, Link } from '../../utils/NodeTypes';
import {
  handleDragStarted,
  handleDragged,
  handleDragEnded,
} from './NodeDragHandlers';
import './NetworkGraph.css';
import { drawConvexHulls } from '../../utils/ConvexHulls';
import { findNodesWithinDegrees } from '../../utils/findNodesWithinDegrees';
import { IInputs } from '../../generated/ManifestTypes';
import { processNodesAndLinks } from '../../services/NodesLink';
import { setupCanvas, handleCanvasResize } from '../../services/Canvas';
import {
  applyNodeStyles,
  applyLinkStyles,
  applyLabelStyles,
} from '../../services/NodesLinkAppearance';
import { LoadingScreen } from '../loading/loading';

const NetworkGraph: React.FC<{
  view: string;
  searchQuery: string;
  degree: number;
  showIntegrationLinks: boolean;
  showAppEnvironments: boolean;
  showIsolatedNodes: boolean;
  context?: ComponentFramework.Context<IInputs>;
}> = ({
  view,
  searchQuery,
  degree,
  showIntegrationLinks: showAppIntegrations,
  showAppEnvironments,
  showIsolatedNodes,
  context,
}) => {
  const {
    technologies,
    applications,
    applicationTechnologies,
    applicationIntegrations,
    applicationEnvironments,
    loading,
  } = useFetchData({ context });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const Modal = React.lazy(() => import('../modals/Modal'));

  useEffect(() => {
    if (
      !technologies.length ||
      !applications.length ||
      !applicationTechnologies.length ||
      !applicationIntegrations.length
    ) {
      return;
    }

    const {
      allNodes,
      appTechLinks,
      integrationLinks,
      commonComponentLinks,
      appEnvironmentLinks,
    } = processNodesAndLinks(
      applications,
      technologies,
      applicationTechnologies,
      applicationIntegrations,
      showAppIntegrations,
      showAppEnvironments,
      applicationEnvironments,
    );

    const links = showAppEnvironments
      ? appEnvironmentLinks
      : showAppIntegrations
        ? [...integrationLinks, ...commonComponentLinks]
        : appTechLinks;

    // Create a set of all node IDs that are referenced in any links
    const linkedNodeIds = new Set(
      links.flatMap(link => [link.source, link.target]),
    );

    // Filter nodes based on the current view and hideUnlinkedNodes flag
    const nodes = allNodes.filter(node => {
      if (showIsolatedNodes || showAppEnvironments) {
        return linkedNodeIds.has(node.id);
        // Hide all unlinked nodes in any view when hideUnlinkedNodes is true
      } else {
        return node.type !== 'technology' || linkedNodeIds.has(node.id);
        // In other views:
        // - Show all nodes (even unlinked)
      }
    });

    /**
     * The rest of the section deals with the creation of the Graph from
     * the data that has been processed above.
     */

    // Set dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create the Canvas in which the Graph will sit on
    const { svg, g } = setupCanvas({
      svgRef,
      width,
      height,
      zoomEnabled: true,
    });

    const simulation = setupSimulation(nodes, links, width, height);

    // Helper function to set opacity based on degrees of separation.
    const updateOpacity = (
      nodesSelection: d3.Selection<any, Node, any, any>,
      linksSelection: d3.Selection<any, Link, any, any>,
      labelsSelection: d3.Selection<any, Node, any, any>,
      nodesWithinDegrees: Set<string>,
    ) => {
      nodesSelection.style('opacity', n =>
        nodesWithinDegrees.has(n.id) ? 1 : 0.2,
      );
      linksSelection.style('opacity', l =>
        nodesWithinDegrees.has((l.source as Node).id) &&
        nodesWithinDegrees.has((l.target as Node).id)
          ? 1
          : 0.2,
      );
      labelsSelection.style('opacity', n =>
        nodesWithinDegrees.has(n.id) ? 1 : 0.2,
      );
    };

    // Add links, nodes, and node labels to the graph
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line');

    const directedLink = g
      .append('g')
      .attr('class', 'directed-links')
      .selectAll('line')
      .data(integrationLinks)
      .enter()
      .append('line');

    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group');

    const labels = g
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'fill-label-light dark:fill-label-dark')
      .attr('dy', -3)
      .text(d => d.id);

    // Apply styles to nodes, links, and node labels
    applyNodeStyles(node);
    applyLinkStyles(link, directedLink);
    applyLabelStyles(labels);

    // Attach Event Handlers
    node
      .on('click', (event, d) => {
        const nodesWithinDegrees = findNodesWithinDegrees(
          nodes,
          links,
          d.id,
          degree,
        );
        updateOpacity(node, link, labels, nodesWithinDegrees);
        event.stopPropagation();
      })
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        setSelectedNode(d);
        setModalVisible(true);
      })
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on('start', handleDragStarted(simulation))
          .on('drag', handleDragged(simulation))
          .on('end', handleDragEnded(simulation)),
      );

    // Reset opacity of elements on click away (the canvas itself)
    svg.on('click', () => {
      updateOpacity(node, link, labels, new Set(nodes.map(n => n.id)));
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x ?? 0)
        .attr('y1', d => (d.source as Node).y ?? 0)
        .attr('x2', d => (d.target as Node).x ?? 0)
        .attr('y2', d => (d.target as Node).y ?? 0);

      directedLink
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      // Position circles
      node
        .selectAll('circle')
        .attr('cx', (d: Node) => d.x ?? 0)
        .attr('cy', (d: Node) => d.y ?? 0);

      // Position squares
      node
        .selectAll('rect')
        .attr('x', (d: Node) => (d.x ?? 0) - 10) // Center the square
        .attr('y', (d: Node) => (d.y ?? 0) - 10);

      labels.attr('x', d => d.x ?? 0).attr('y', d => d.y ?? 0);

      // Draw Conex Hulls Enclosure when cluster view is selected
      if (view === VIEW_OPTIONS.CLUSTER) {
        drawConvexHulls(g, nodes);
      }
    });

    // Handle search query
    applySearch(
      g,
      nodes,
      links,
      simulation,
      searchQuery,
      degree,
      width,
      height,
    );

    // Update simulation based on the view
    updateSimulationForView(simulation, view, nodes, links, width, height);

    // Resize canvas on window resize
    const cleanupResize = handleCanvasResize(svgRef, simulation);

    return () => {
      cleanupResize(); // Remove resize event listener on unmount
    };
  }, [
    technologies,
    applications,
    applicationTechnologies,
    applicationIntegrations,
    showAppIntegrations,
    showAppEnvironments,
    showIsolatedNodes,
    view,
    searchQuery,
    degree,
    loading,
  ]);

  if (loading) {
    console.log('IS LOADING');
    return <LoadingScreen />;
  } else {
    console.log('SHOULD RENDER');
    return (
      <div>
        <svg ref={svgRef}></svg>
        <Suspense fallback={<div>Loading</div>}>
          {modalVisible && selectedNode && (
            <Modal onClose={() => setModalVisible(false)} node={selectedNode} />
          )}
        </Suspense>
      </div>
    );
  }
};

export default NetworkGraph;
