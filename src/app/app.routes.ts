import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers/:id',
    loadComponent: () =>
      import('./components/customers/customer-profile/customer-profile.component').then(
        (m) => m.CustomerProfileComponent
      ),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./components/reviews/review-list/review-list.component').then(
        (m) => m.ReviewListComponent
      ),
  },
  {
    path: 'reviews/new',
    loadComponent: () =>
      import('./components/reviews/review-form/review-form.component').then(
        (m) => m.ReviewFormComponent
      ),
  },
  { path: '', redirectTo: 'reviews', pathMatch: 'full' },
];
