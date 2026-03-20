import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Destination } from '../models/destination.model';
import { TourPackage } from '../models/package.model';
import { Flight } from '../models/flight.model';
import { Hotel } from '../models/hotel.model';
import { Booking } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { Review } from '../models/review.model';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    const token = this.auth.token();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // Destinations
  getDestinations() { return this.http.get<Destination[]>(`${this.BASE}/destinations`); }
  getDestination(id: number) { return this.http.get<Destination>(`${this.BASE}/destinations/${id}`); }
  createDestination(d: Partial<Destination>) { return this.http.post<Destination>(`${this.BASE}/destinations`, d, { headers: this.headers() }); }
  updateDestination(id: number, d: Partial<Destination>) { return this.http.put<Destination>(`${this.BASE}/destinations/${id}`, d, { headers: this.headers() }); }
  deleteDestination(id: number) { return this.http.delete(`${this.BASE}/destinations/${id}`, { headers: this.headers() }); }

  // Packages
  getPackages() { return this.http.get<TourPackage[]>(`${this.BASE}/packages`); }
  getPackage(id: number) { return this.http.get<TourPackage>(`${this.BASE}/packages/${id}`); }
  createPackage(p: Partial<TourPackage>) { return this.http.post<TourPackage>(`${this.BASE}/packages`, p, { headers: this.headers() }); }
  updatePackage(id: number, p: Partial<TourPackage>) { return this.http.put<TourPackage>(`${this.BASE}/packages/${id}`, p, { headers: this.headers() }); }
  deletePackage(id: number) { return this.http.delete(`${this.BASE}/packages/${id}`, { headers: this.headers() }); }

  // Flights
  getFlights() { return this.http.get<Flight[]>(`${this.BASE}/flights`); }
  getFlight(id: number) { return this.http.get<Flight>(`${this.BASE}/flights/${id}`); }
  createFlight(f: Partial<Flight>) { return this.http.post<Flight>(`${this.BASE}/flights`, f, { headers: this.headers() }); }
  updateFlight(id: number, f: Partial<Flight>) { return this.http.put<Flight>(`${this.BASE}/flights/${id}`, f, { headers: this.headers() }); }
  deleteFlight(id: number) { return this.http.delete(`${this.BASE}/flights/${id}`, { headers: this.headers() }); }

  // Hotels
  getHotels() { return this.http.get<Hotel[]>(`${this.BASE}/hotels`); }
  getHotel(id: number) { return this.http.get<Hotel>(`${this.BASE}/hotels/${id}`); }
  createHotel(h: Partial<Hotel>) { return this.http.post<Hotel>(`${this.BASE}/hotels`, h, { headers: this.headers() }); }
  updateHotel(id: number, h: Partial<Hotel>) { return this.http.put<Hotel>(`${this.BASE}/hotels/${id}`, h, { headers: this.headers() }); }
  deleteHotel(id: number) { return this.http.delete(`${this.BASE}/hotels/${id}`, { headers: this.headers() }); }

  // Bookings
  getBookings() { return this.http.get<Booking[]>(`${this.BASE}/bookings`, { headers: this.headers() }); }
  getMyBookings() { return this.http.get<Booking[]>(`${this.BASE}/bookings/my`, { headers: this.headers() }); }
  getBooking(id: number) { return this.http.get<Booking>(`${this.BASE}/bookings/${id}`, { headers: this.headers() }); }
  createBooking(b: any) { return this.http.post<Booking>(`${this.BASE}/bookings`, b, { headers: this.headers() }); }
  updateBookingStatus(id: number, status: string) { return this.http.patch(`${this.BASE}/bookings/${id}/status`, { status }, { headers: this.headers() }); }

  // Payments
  getPayments() { return this.http.get<Payment[]>(`${this.BASE}/payments`, { headers: this.headers() }); }
  createPayment(p: any) { return this.http.post<Payment>(`${this.BASE}/payments`, p, { headers: this.headers() }); }

  // Reviews
  getReviews() { return this.http.get<Review[]>(`${this.BASE}/reviews`); }
  createReview(r: any) { return this.http.post<Review>(`${this.BASE}/reviews`, r, { headers: this.headers() }); }
  getReviewAvg(item_type: string, item_id: number) { return this.http.get<{count:number,avg:number}>(`${this.BASE}/reviews/avg?item_type=${item_type}&item_id=${item_id}`); }
  deleteReview(id: number) { return this.http.delete(`${this.BASE}/reviews/${id}`, { headers: this.headers() }); }

  // Customers (Admin)
  getCustomers() { return this.http.get<Customer[]>(`${this.BASE}/customers`, { headers: this.headers() }); }
  getCustomer(id: number) { return this.http.get<Customer>(`${this.BASE}/customers/${id}`, { headers: this.headers() }); }
  updateCustomer(id: number, c: Partial<Customer>) { return this.http.put<Customer>(`${this.BASE}/customers/${id}`, c, { headers: this.headers() }); }
}