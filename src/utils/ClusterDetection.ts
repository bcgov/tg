import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import { Node, Link } from '../types/NodeTypes';

export const detectClusters = (nodes: Node[], links: Link[]) => {
  const graph = new Graph();

  // Add nodes to the graph, ensuring no duplicates
  nodes.forEach(node => {
    if (!graph.hasNode(node.id)) {
      graph.addNode(node.id);
    }
  });

  // Add links to the graph
  links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    if (graph.hasNode(sourceId) && graph.hasNode(targetId) && !graph.hasEdge(sourceId, targetId)) {
      graph.addEdge(sourceId, targetId);
    }
  });

  const clusters = louvain(graph);

  // Add cluster information to nodes
  nodes.forEach(node => {
    node.cluster = clusters[node.id];
  });

  return nodes;
};
