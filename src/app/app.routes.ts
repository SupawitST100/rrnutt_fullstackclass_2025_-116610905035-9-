import { Routes } from '@angular/router';

// สังเกตว่าเรา Import ชื่อคลาสแบบสั้นๆ ตามที่มีในไฟล์ .ts ของจริง
import { Home } from './components/home/home';
import { Destinations } from './components/destinations/destinations';
import { Packages } from './components/packages/packages';
import { Customers } from './components/customers/customers';
import { Reviews } from './components/reviews/reviews';
import { Bookings } from './components/bookings/bookings';
import { Payments } from './components/payments/payments';
import { Flights } from './components/flights/flights';
import { Hotels } from './components/hotels/hotels';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'destinations', component: Destinations },
  { path: 'packages', component: Packages },
  { path: 'customers', component: Customers },
  { path: 'reviews', component: Reviews },
  { path: 'bookings', component: Bookings },
  { path: 'payments', component: Payments },
  { path: 'flights', component: Flights },
  { path: 'hotels', component: Hotels },
  
  // ดักจับกรณีพิมพ์ URL มั่ว ให้เด้งกลับมาหน้าแรก
  { path: '**', redirectTo: '' }
];