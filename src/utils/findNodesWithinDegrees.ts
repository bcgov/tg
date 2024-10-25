import { Node, Link } from '../types/NodeTypes';

export const findNodesWithinDegrees = (
  nodes: Node[],
  links: Link[],
  targetNodeId: string,
  degree: number,
): Set<string> => {
  const targetNodeIds = new Set<string>([targetNodeId]);

  for (let i = 0; i < degree; i++) {
    const newNodes = new Set<string>();
    links.forEach(link => {
      const sourceId = (link.source as Node).id;
      const targetId = (link.target as Node).id;
      if (targetNodeIds.has(sourceId) || targetNodeIds.has(targetId)) {
        newNodes.add(sourceId);
        newNodes.add(targetId);
      }
    });
    newNodes.forEach(nodeId => targetNodeIds.add(nodeId));
  }

  return targetNodeIds;
};
