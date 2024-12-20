import * as d3 from 'd3';
import { Node } from '../types/NodeTypes';

export const drawConvexHulls = (
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
) => {
  const clusters = d3.group(nodes, d => d.cluster);

  const hullData: [number, number][][] = [];

  clusters.forEach(nodeGroup => {
    const points = nodeGroup
      .filter(node => node.x !== undefined && node.y !== undefined)
      .map(node => [node.x as number, node.y as number] as [number, number]);

    const hull = d3.polygonHull(points);
    if (hull) {
      hullData.push(hull);
    }
  });

  // Draw hulls behind nodes
  const hulls = g.selectAll<SVGPathElement, [number, number][]>('.hull').data(hullData);

  hulls
    .enter()
    .append('path')
    .attr('class', 'hull')
    .merge(hulls)
    .attr('d', d => 'M' + d.join('L') + 'Z')
    .attr('fill', 'rgba(173, 216, 230, 0.3)') // Light blue with some opacity
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .style('pointer-events', 'none'); // Ensure hulls don't block interactions

  hulls.exit().remove();
};
