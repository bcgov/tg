// NodeTypes.ts
export interface Node extends d3.SimulationNodeDatum {
  id: string;
  techId?: string | null;
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
  appname?: string | null;
  businessarea?: string | null;
  businesssme?: string | null;
  applicationstatus?: boolean | null;
  hostingplatform?: string | null;
  identityintegrations?: string | null;
  criticalsystem?: boolean | null;
  devurl?: string | null;
  produrl?: string | null;
  description?: string | null;
  openshiftInfo?: string | null;
  githubInfo?: string | null;
}

export interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}
