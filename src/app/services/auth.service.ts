import { Injectable, signal } from '@angular/core';

/** Simulates the currently logged-in customer session. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** In a real app this would come from JWT / OAuth. */
  private readonly _currentCustomerId = signal<string>('c001');

  get currentCustomerId(): string {
    return this._currentCustomerId();
  }

  /** Switch the active user (for demo/testing purposes). */
  switchUser(id: string): void {
    this._currentCustomerId.set(id);
  }
}
