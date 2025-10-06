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
      { name: "Vision Blueprint", type: "ai", powerBoost: 10, installed: false },
      { name: "Faith Reinforcement", type: "community", powerBoost: 5, installed: false },
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
      { name: "Discipline Beam", type: "security", powerBoost: 10, installed: false },
      { name: "Growth Column", type: "prediction", powerBoost: 10, installed: false },
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
      { name: "Brand Polish", type: "crypto", powerBoost: 15, installed: false },
      { name: "Strategic Reach", type: "ai", powerBoost: 20, installed: false },
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
      { name: "Legacy Seal", type: "community", powerBoost: 25, installed: false },
      { name: "Cultural Impact", type: "security", powerBoost: 30, installed: false },
    ],
  },
];

export default buildingPhases;