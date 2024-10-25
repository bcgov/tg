// NodeDragHandlers.ts
import * as d3 from 'd3';
import { Node } from '../../types/NodeTypes';

export const handleDragStarted = (simulation: d3.Simulation<Node, undefined>) => {
  return (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };
};

export const handleDragged = () => {
  return (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
    d.fx = event.x;
    d.fy = event.y;
  };
};

export const handleDragEnded = (simulation: d3.Simulation<Node, undefined>) => {
  return (event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };
};
