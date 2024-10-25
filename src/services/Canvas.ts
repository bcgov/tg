/**
 * Canvas.ts
 * - Builds the Canvas plane object in which the graph will be projected to.
 * - Describes how the canvas should behave on resize
 * - Describes how arrowhead marker should look
 */
import * as d3 from 'd3';
import { setupZoom } from '../utils/Zoom';

interface CanvasConfig {
  svgRef: React.RefObject<SVGSVGElement>;
  width: number;
  height: number;
  zoomEnabled?: boolean;
}

export const setupCanvas = ({
  svgRef,
  width,
  height,
  zoomEnabled = true,
}: CanvasConfig) => {
  // Select the SVG element from the DOM
  const svg = d3
    .select(svgRef.current)
    .attr('width', width)
    .attr('height', height);

  // Clear any existing content
  svg.selectAll('*').remove();

  // Define arrowhead marker for directed links
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 15) // Adjust this to position the arrowhead
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke', 'none');

  // Create the main group to hold the graph content
  const g = svg.append('g');

  // Setup zoom if enabled
  if (zoomEnabled) {
    setupZoom(svg, g, width, height);
  }

  return { svg, g };
};

export const handleCanvasResize = (
  svgRef: React.RefObject<SVGSVGElement>,
  simulation: d3.Simulation<any, any>,
) => {
  const handleResize = () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    const svg = d3.select(svgRef.current);
    svg.attr('width', newWidth).attr('height', newHeight);

    simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(1).restart();
  };

  // Add resize event listener
  window.addEventListener('resize', handleResize);

  // Return cleanup function to remove event listener on unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};
