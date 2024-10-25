/**
 * Simulations.ts
 * - Describes how the Graph should be projected in different views, including animations, gravity, collision detections, etc.
 */
import * as d3 from 'd3';
import { Node, Link } from '../types/NodeTypes';
import { detectClusters } from '../utils/ClusterDetection';

// View options
export const VIEW_OPTIONS = {
  PLANAR: 'planar',
  TREE_APPLICATIONS: 'tree_applications',
  TREE_TECHNOLOGIES: 'tree_technologies',
  CLUSTER: 'cluster',
};

export const setupSimulation = (nodes: Node[], links: Link[], width: number, height: number) => {
  return d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id((d: Node) => d.id)
        .distance(150), // Increased link distance for better node separation
    )
    .force('charge', d3.forceManyBody().strength(-200)) // Stronger repulsion to spread nodes out
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'collide',
      d3.forceCollide().radius(40), // Increased collision radius to prevent overlap
    );
};

export const updateSimulationForView = (
  simulation: d3.Simulation<Node, undefined>,
  view: string,
  nodes: Node[],
  links: Link[],
  width: number,
  height: number,
) => {
  switch (view) {
    case VIEW_OPTIONS.PLANAR:
      simulation
        .force(
          'link',
          d3
            .forceLink(links)
            .id((d: Node) => d.id)
            .distance(100),
        )
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius(30));
      break;
    case VIEW_OPTIONS.CLUSTER:
      nodes = detectClusters(nodes, links);
      simulation.nodes(nodes);
      break;
    default:
      break;
  }
  simulation.alpha(1).restart();
};

export const applySearch = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  links: Link[],
  simulation: d3.Simulation<Node, undefined>,
  searchQuery: string,
  degree: number,
  width: number,
  height: number,
) => {
  if (!g) return;

  if (searchQuery) {
    const matchedNodes = nodes.filter(node =>
      node.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const matchedNodeIds = new Set(matchedNodes.map(node => node.id));

    // Find nodes within specified degrees of separation
    const nodesWithinDegrees = new Set<string>(matchedNodeIds);

    for (let i = 0; i < degree; i++) {
      const newNodes = new Set<string>();
      links.forEach(link => {
        const sourceId = (link.source as Node).id;
        const targetId = (link.target as Node).id;
        if (nodesWithinDegrees.has(sourceId) || nodesWithinDegrees.has(targetId)) {
          newNodes.add(sourceId);
          newNodes.add(targetId);
        }
      });
      newNodes.forEach(nodeId => nodesWithinDegrees.add(nodeId));
    }

    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'charge',
        d3.forceManyBody<Node>().strength(d => (matchedNodeIds.has(d.id) ? -30 : -100)),
      )
      .force(
        'collide',
        d3.forceCollide<Node>().radius(d => (matchedNodeIds.has(d.id) ? 20 : 30)),
      )
      .force(
        'x',
        d3
          .forceX<Node>((d: Node) => (matchedNodeIds.has(d.id) ? width / 2 : (d.x ?? width / 2)))
          .strength(0.1),
      )
      .force(
        'y',
        d3
          .forceY<Node>((d: Node) => (matchedNodeIds.has(d.id) ? height / 2 : (d.y ?? height / 2)))
          .strength(0.1),
      );

    g.selectAll<SVGCircleElement, Node>('circle')
      .style('opacity', d => (nodesWithinDegrees.has(d.id) ? 1 : 0.2))
      .style('stroke', d => (matchedNodeIds.has(d.id) ? 'purple' : null))
      .style('stroke-width', d => (matchedNodeIds.has(d.id) ? '3px' : null));
    g.selectAll<SVGCircleElement, Node>('rect')
      .style('opacity', d => (nodesWithinDegrees.has(d.id) ? 1 : 0.2))
      .style('stroke', d => (matchedNodeIds.has(d.id) ? 'purple' : null))
      .style('stroke-width', d => (matchedNodeIds.has(d.id) ? '3px' : null));

    g.selectAll<SVGLineElement, Link>('line').style('opacity', d =>
      nodesWithinDegrees.has((d.source as Node).id) && nodesWithinDegrees.has((d.target as Node).id)
        ? 1
        : 0.2,
    );
  } else {
    g.selectAll<SVGCircleElement, Node>('circle')
      .style('opacity', 1)
      .style('stroke', null)
      .style('stroke-width', null);

    g.selectAll<SVGLineElement, Link>('line').style('opacity', 1);
  }
};
