// NodeTypes.ts
export interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number | undefined;
  cluster?: number | null;
  productOwner?: string | null;
  riskLevel?: number | null;
  eolDate?: Date | null;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}
