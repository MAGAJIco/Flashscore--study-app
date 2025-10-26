
// Models barrel export - only client-safe types
export * from './author';
export * from './pytorchModel';

// Re-export only types from user, match, and team (no Mongoose models)
export type { IUser, ICoppaConsent, User } from './user';
export type { Match } from './match';
export type { Team } from './team';
