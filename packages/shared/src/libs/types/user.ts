
export interface User {
  _id?: string;
  id?: string;
  email: string;
  username: string;
  password?: string;
  role?: string;
  displayName?: string;
  avatar?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  preferences?: UserPreferences;
  kidsMode?: boolean;
  coppaConsent?: ICoppaConsent;
}

export interface UserPreferences {
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
  favoriteTeams?: string[];
  favoriteLeagues?: string[];
  notifications?: boolean;
}

export interface ICoppaConsent {
  isVerified: boolean;
  parentEmail?: string;
  consentDate?: Date | string;
  ageVerified?: boolean;
}
