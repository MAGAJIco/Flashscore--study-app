const buildingPhases = [
  {
    id: "foundation",
    name: "Foundation Stage",
    description: "Laying the groundwork of the MagajiCo Empire.",
    requiredPower: 0,
    unlocked: true,
    building: false,
    completed: false,
    components: [
      { name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
      { name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
    ],
  },
  {
    id: "structure",
    name: "Structural Stage",
    description: "Building the pillars of leadership and strength.",
    requiredPower: 15,
    unlocked: false,
    building: false,
    completed: false,
    components: [
      { name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
      { name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
    ],
  },
  {
    id: "finishing",
    name: "Finishing Touch",
    description: "Refining excellence for visibility and influence.",
    requiredPower: 30,
    unlocked: false,
    building: false,
    completed: false,
    components: [
      { name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
      { name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
    ],
  },
  {
    id: "rooftop",
    name: "Legendary Rooftop",
    description: "Your empire now shines across generations.",
    requiredPower: 60,
    unlocked: false,
    building: false,
    completed: false,
    components: [
      { name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
      { name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
    ],
  },
];

export default buildingPhases;