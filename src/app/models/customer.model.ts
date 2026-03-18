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
