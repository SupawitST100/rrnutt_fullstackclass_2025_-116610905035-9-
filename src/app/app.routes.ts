import { Routes } from '@angular/router';
<<<<<<< HEAD
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'destinations',
    loadComponent: () => import('./components/destinations/destinations.component').then(m => m.DestinationsComponent)
  },
  {
    path: 'packages',
    loadComponent: () => import('./components/packages/packages.component').then(m => m.PackagesComponent)
  },
  {
    path: 'flights',
    loadComponent: () => import('./components/flights/flights.component').then(m => m.FlightsComponent)
  },
  {
    path: 'hotels',
    loadComponent: () => import('./components/hotels/hotels.component').then(m => m.HotelsComponent)
  },
  {
    path: 'reviews',
    loadComponent: () => import('./components/reviews/reviews.component').then(m => m.ReviewsComponent)
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./components/bookings/bookings.component').then(m => m.BookingsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: '' }
=======

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
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
];
