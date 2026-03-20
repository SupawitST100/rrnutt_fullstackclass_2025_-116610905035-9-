<<<<<<< HEAD
export interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  created_at?: string;
  role?: 'user' | 'admin';
}

export interface AuthUser {
  token: string;
  customer: Customer;
}
=======
export type MemberTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface CustomerAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  nationality: string;
  passportNumber?: string;
  dateOfBirth: Date;
  memberSince: Date;
  tier: MemberTier;
  totalBookings: number;
  totalSpent: number;
  preferredLanguage: string;
  address: CustomerAddress;
}

export interface CustomerSummary {
  id: string;
  fullName: string;
  email: string;
  tier: MemberTier;
  totalBookings: number;
  avatarUrl?: string;
}
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
