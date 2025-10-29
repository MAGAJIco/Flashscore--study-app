import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComponent {
  name: string;
  type: 'ai' | 'prediction' | 'community' | 'crypto' | 'security';
  powerBoost: number;
  installed: boolean;
}

export interface IPhase {
  id: string;
  name: string;
  description: string;
  requiredPower: number;
  unlocked: boolean;
  building: boolean;
  completed: boolean;
  components: IComponent[];
}

export interface IFoundation extends Document {
  userId: string;
  totalPower: number;
  phases: IPhase[];
  createdAt: Date;
  updatedAt: Date;
}

interface IFoundationModel extends Model<IFoundation> {
  getDefaultPhases(): IPhase[];
}

const ComponentSchema = new Schema<IComponent>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['ai', 'prediction', 'community', 'crypto', 'security']
  },
  powerBoost: { type: Number, required: true },
  installed: { type: Boolean, default: false }
});

const PhaseSchema = new Schema<IPhase>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  requiredPower: { type: Number, required: true },
  unlocked: { type: Boolean, default: false },
  building: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  components: [ComponentSchema]
});

const FoundationSchema = new Schema<IFoundation>(
  {
    userId: { 
      type: String, 
      required: true,
      unique: true,
      index: true
    },
    totalPower: { type: Number, default: 0 },
    phases: [PhaseSchema]
  },
  { timestamps: true }
);

// Initialize default phases
FoundationSchema.statics.getDefaultPhases = function(): IPhase[] {
  return [
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
};


export const Foundation = mongoose.model<IFoundation, IFoundationModel>('Foundation', FoundationSchema);