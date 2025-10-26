
// Shared types that can be used on both client and server
export interface ICoppaConsent {
  status: "pending" | "approved" | "rejected" | null;
  parentEmail?: string | null;
  requestedAt?: Date | null;
  verifiedAt?: Date | null;
}

export interface IUser {
  id?: string;
  email: string;
  age?: number | null;
  isUnder13?: boolean;
  kidsMode?: boolean;
  coppaConsent?: ICoppaConsent;
  createdAt?: Date;
  updatedAt?: Date;
}

// Client-safe user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "user";
  createdAt: Date;
  updatedAt: Date;
}
