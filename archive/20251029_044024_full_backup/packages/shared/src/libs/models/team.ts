// packages/shared/src/libs/models/team.ts

export interface Team {
  id: string;
  name: string;
  country: string;
  foundedYear?: number;
  stadium?: string;
  createdAt: Date;
  updatedAt: Date;
}