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
      { id: "vision-blueprint", name: "Vision Blueprint", type: "ai" as const, powerBoost: 10, installed: false },
      { id: "faith-reinforcement", name: "Faith Reinforcement", type: "community" as const, powerBoost: 5, installed: false },
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
      { id: "discipline-beam", name: "Discipline Beam", type: "security" as const, powerBoost: 10, installed: false },
      { id: "growth-column", name: "Growth Column", type: "prediction" as const, powerBoost: 10, installed: false },
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
      { id: "brand-polish", name: "Brand Polish", type: "crypto" as const, powerBoost: 15, installed: false },
      { id: "strategic-reach", name: "Strategic Reach", type: "ai" as const, powerBoost: 20, installed: false },
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
      { id: "legacy-seal", name: "Legacy Seal", type: "community" as const, powerBoost: 25, installed: false },
      { id: "cultural-impact", name: "Cultural Impact", type: "security" as const, powerBoost: 30, installed: false },
    ],
  },
];

export default buildingPhases;