
export interface UserProfile {
  id?: string;
  user_id?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  updated_at?: string;
}

export interface UserWithProfile {
  id: string;
  email?: string;
  role?: string;
  profile?: UserProfile;
}

export interface AuthStore {
  user: UserWithProfile | null;
  impersonatedUser: UserWithProfile | null;
  session: any | null;
  loading: boolean;
  initialized: boolean;
  setSession: (session: any | null) => void;
  setUser: (user: UserWithProfile | null) => void;
  setImpersonatedUser: (user: UserWithProfile | null) => void;
  reset: () => void;
}
