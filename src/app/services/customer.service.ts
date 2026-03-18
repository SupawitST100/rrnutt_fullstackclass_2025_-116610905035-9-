import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Customer, CustomerSummary, MemberTier } from '../models/customer.model';

const FAKE_CUSTOMERS: Customer[] = [
  {
    id: 'c001',
    firstName: 'Somchai',
    lastName: 'Jaidee',
    email: 'somchai.j@email.com',
    phone: '+66 81-234-5678',
    nationality: 'Thai',
    passportNumber: 'AA123456',
    dateOfBirth: new Date('1988-04-12'),
    memberSince: new Date('2020-01-15'),
    tier: 'silver',
    totalBookings: 6,
    totalSpent: 100000,
    preferredLanguage: 'th',
    address: { street: '123 Sukhumvit Rd', city: 'Bangkok', country: 'Thailand', postalCode: '10110' },
  },
  {
    id: 'c002',
    firstName: 'Nattaya',
    lastName: 'Wongkham',
    email: 'nattaya.w@email.com',
    phone: '+66 89-876-5432',
    nationality: 'Thai',
    dateOfBirth: new Date('1993-08-25'),
    memberSince: new Date('2021-06-10'),
    tier: 'silver',
    totalBookings: 7,
    totalSpent: 98000,
    preferredLanguage: 'th',
    address: { street: '456 Nimman Rd', city: 'Chiang Mai', country: 'Thailand', postalCode: '50200' },
  },
  {
    id: 'c003',
    firstName: 'James',
    lastName: 'Anderson',
    email: 'james.a@email.com',
    phone: '+1 415-555-0192',
    nationality: 'American',
    passportNumber: 'US987654',
    dateOfBirth: new Date('1985-11-03'),
    memberSince: new Date('2019-03-22'),
    tier: 'platinum',
    totalBookings: 35,
    totalSpent: 680000,
    preferredLanguage: 'en',
    address: { street: '789 Market St', city: 'San Francisco', country: 'United States', postalCode: '94103' },
  },
];

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [...FAKE_CUSTOMERS];

  getAll(): Observable<CustomerSummary[]> {
    const summaries: CustomerSummary[] = this.customers.map((c) => ({
      id: c.id,
      fullName: `${c.firstName} ${c.lastName}`,
      email: c.email,
      tier: c.tier,
      totalBookings: c.totalBookings,
      avatarUrl: c.avatarUrl,
    }));
    return of(summaries).pipe(delay(300));
  }

  getById(id: string): Observable<Customer> {
    const customer = this.customers.find((c) => c.id === id);
    if (!customer) return throwError(() => new Error(`Customer ${id} not found`));
    return of({ ...customer }).pipe(delay(300));
  }

  create(data: Omit<Customer, 'id' | 'memberSince' | 'totalBookings' | 'totalSpent'>): Observable<Customer> {
    const newCustomer: Customer = {
      ...data,
      id: `c${Date.now()}`,
      memberSince: new Date(),
      totalBookings: 0,
      totalSpent: 0,
    };
    this.customers.push(newCustomer);
    return of(newCustomer).pipe(delay(300));
  }

  update(id: string, data: Partial<Customer>): Observable<Customer> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return throwError(() => new Error(`Customer ${id} not found`));
    this.customers[index] = { ...this.customers[index], ...data };
    return of({ ...this.customers[index] }).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) return throwError(() => new Error(`Customer ${id} not found`));
    this.customers.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  getTierLabel(tier: MemberTier): string {
    const labels: Record<MemberTier, string> = {
      bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
    };
    return labels[tier];
  }
}
