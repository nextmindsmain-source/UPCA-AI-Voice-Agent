export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceStart: string;
}

export enum AgentType {
  FRONT_DESK = 'FRONT_DESK',
  DISPATCH = 'DISPATCH'
}

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  voiceName: string;
  systemInstruction: string;
}

// Audio Types for Live API
export type PcmBlob = {
  data: string;
  mimeType: string;
};
