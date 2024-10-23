import * as d3 from "d3";

export function setupZoom(svg, g, width, height) {
  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => g.attr("transform", event.transform));

  svg
    .call(zoom)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 3, height / 3).scale(0.4)
    );
}
