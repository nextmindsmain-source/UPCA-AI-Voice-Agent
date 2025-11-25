import { AgentType, AgentConfig, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'photo',
    title: 'HDR Photography',
    description: 'Magazine-quality HDR photos blended to perfection. Blue sky replacement included.',
    icon: 'camera',
    priceStart: '$150'
  },
  {
    id: 'video',
    title: 'Cinematic Video Tours',
    description: '4K interior and exterior video tours with licensed music and smooth stabilization.',
    icon: 'video',
    priceStart: '$300'
  },
  {
    id: 'matterport',
    title: '360 Matterport Tours',
    description: 'Immersive 3D walkthroughs allowing potential buyers to explore every corner.',
    icon: 'box',
    priceStart: '$200'
  },
  {
    id: 'drone',
    title: 'Drone Aerials',
    description: 'High-resolution aerial photography and videography to showcase the property location.',
    icon: 'plane',
    priceStart: '$175'
  },
  {
    id: 'web',
    title: 'Property Websites',
    description: 'Dedicated single-property websites with lead capture and analytics.',
    icon: 'globe',
    priceStart: '$100'
  },
  {
    id: 'marketing',
    title: 'Social Media Kits',
    description: 'Ready-to-post Reels, Stories, and flyers designed for Instagram and Facebook.',
    icon: 'share',
    priceStart: '$150'
  }
];

export const PRICING_PACKAGES = [
  {
    name: 'Essential',
    price: '$299',
    features: ['25 HDR Photos', 'Drone Photos (5)', 'Marketing Kit', '24h Turnaround']
  },
  {
    name: 'Premium',
    price: '$549',
    features: ['40 HDR Photos', 'Cinematic Video (60s)', 'Drone Photos & Video', 'Property Website', 'Blue Sky Guarantee']
  },
  {
    name: 'Luxury',
    price: '$899',
    features: ['Unlimited HDR Photos', 'Agent Intro Video', 'Matterport 3D Tour', 'Twilight Photography', 'Social Media Management']
  }
];

const COMPANY_CONTEXT = `
You are an AI employee for UPCA, a premium Real Estate Marketing Agency based in Canada (upca.ca).
Our Services: HDR Photography, Video Tours, 360 Matterport, Drone, Single Property Websites, and Marketing Kits.
Pricing Overview: Essentials start at $299, Premium at $549, Luxury at $899. A la carte photos start at $150.
Booking Process: Clients can book online at upca.ca/booking or by calling us. We require a 24-hour notice for most shoots.
Turnaround: Photos by 10 AM next day. Video within 48 hours.
Company Values: Quality, Speed, Reliability.
`;

export const AGENTS: Record<AgentType, AgentConfig> = {
  [AgentType.FRONT_DESK]: {
    id: AgentType.FRONT_DESK,
    name: 'Sarah (Front Desk)',
    role: 'Receptionist',
    description: 'Warm, welcoming, and informative. Great for general inquiries and booking.',
    voiceName: 'Kore',
    systemInstruction: `
      ${COMPANY_CONTEXT}
      Your Role: You are Sarah, the Front Desk Receptionist.
      Tone: Warm, professional, patient, and polite. Like a high-end hotel concierge.
      Goal: Answer questions about services, explain pricing gently, and guide them to book an appointment.
      Style: Use full sentences. Be very courteous. If you don't know an answer, apologize and offer to have a manager call back.
      Greeting: "Thank you for calling UPCA Media. This is Sarah. How can I help showcase your listing today?"
    `
  },
  [AgentType.DISPATCH]: {
    id: AgentType.DISPATCH,
    name: 'Mike (Emergency Dispatch)',
    role: 'Rush Order Specialist',
    description: 'Fast, efficient, and solution-oriented. Handles last-minute requests.',
    voiceName: 'Fenrir',
    systemInstruction: `
      ${COMPANY_CONTEXT}
      Your Role: You are Mike, the Emergency Dispatch & Rush Order Coordinator.
      Tone: Fast-paced, efficient, confident, slightly hurried but competent. 
      Goal: Solve "crisis" situations (e.g., "I need photos tomorrow at 8 AM"). Confirm availability quickly. Emphasize our Rush delivery options (Same day delivery is +$100).
      Style: Short sentences. Direct. Focus on "Getting it done".
      Greeting: "UPCA Dispatch, Mike speaking. What's the address and deadline?"
    `
  }
};
