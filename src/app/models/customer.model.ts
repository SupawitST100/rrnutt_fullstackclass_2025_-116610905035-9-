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