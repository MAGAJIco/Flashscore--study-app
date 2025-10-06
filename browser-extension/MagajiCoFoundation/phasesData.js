const buildingPhases = [
  {
    id: "foundation",
    title: "Foundation Stage",
    description: "Laying the groundwork of the MagajiCo Empire.",
    requiredPower: 0,
    completed: false,
    building: false,
    unlocked: true,
    components: [
      { name: "Vision Blueprint", powerBoost: 10, installed: false },
      { name: "Faith Reinforcement", powerBoost: 5, installed: false },
    ],
  },
  {
    id: "structure",
    title: "Structural Stage",
    description: "Building the core pillars of strength and consistency.",
    requiredPower: 15,
    completed: false,
    building: false,
    unlocked: false,
    components: [
      { name: "Discipline Beams", powerBoost: 10, installed: false },
      { name: "Skill Expansion", powerBoost: 10, installed: false },
    ],
  },
  {
    id: "finishing",
    title: "Finishing Stage",
    description: "Refining excellence and alignment for leadership impact.",
    requiredPower: 30,
    completed: false,
    building: false,
    unlocked: false,
    components: [
      { name: "Vision Branding", powerBoost: 15, installed: false },
      { name: "Global Network", powerBoost: 20, installed: false },
    ],
  },
  {
    id: "rooftop",
    title: "Legendary Rooftop",
    description: "Reaching legacy level — your empire now shines.",
    requiredPower: 60,
    completed: false,
    building: false,
    unlocked: false,
    components: [
      { name: "Legacy Seal", powerBoost: 25, installed: false },
      { name: "Cultural Impact", powerBoost: 30, installed: false },
    ],
  },
];

export default buildingPhases;