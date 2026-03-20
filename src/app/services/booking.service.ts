import { Injectable } from '@angular/core';
<<<<<<< HEAD

@Injectable({ providedIn: 'root' })
export class BookingService {}
=======
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

const FAKE_BOOKINGS: Booking[] = [
  {
    id: 'b001',
    customerId: 'c001',
    destinationId: 'd001',
    destinationName: 'Bali',
    destinationFlag: '🇮🇩',
    destinationCountry: 'Indonesia',
    travelDate: new Date('2024-08-10'),
    reviewed: true,
  },
  {
    id: 'b004',
    customerId: 'c001',
    destinationId: 'd006',
    destinationName: 'Bangkok',
    destinationFlag: '🇹🇭',
    destinationCountry: 'Thailand',
    travelDate: new Date('2024-05-20'),
    reviewed: false,
  },
  {
    id: 'b005',
    customerId: 'c001',
    destinationId: 'd007',
    destinationName: 'Singapore',
    destinationFlag: '🇸🇬',
    destinationCountry: 'Singapore',
    travelDate: new Date('2024-03-15'),
    reviewed: false,
  },
  {
    id: 'b002',
    customerId: 'c002',
    destinationId: 'd002',
    destinationName: 'Tokyo',
    destinationFlag: '🇯🇵',
    destinationCountry: 'Japan',
    travelDate: new Date('2024-09-05'),
    reviewed: true,
  },
  {
    id: 'b006',
    customerId: 'c002',
    destinationId: 'd004',
    destinationName: 'Paris',
    destinationFlag: '🇫🇷',
    destinationCountry: 'France',
    travelDate: new Date('2024-06-10'),
    reviewed: false,
  },
  {
    id: 'b003',
    customerId: 'c003',
    destinationId: 'd003',
    destinationName: 'Santorini',
    destinationFlag: '🇬🇷',
    destinationCountry: 'Greece',
    travelDate: new Date('2024-07-20'),
    reviewed: true,
  },
  {
    id: 'b007',
    customerId: 'c003',
    destinationId: 'd009',
    destinationName: 'Dubai',
    destinationFlag: '🇦🇪',
    destinationCountry: 'UAE',
    travelDate: new Date('2024-11-01'),
    reviewed: false,
  },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: Booking[] = [...FAKE_BOOKINGS];

  getByCustomer(customerId: string): Observable<Booking[]> {
    return of(this.bookings.filter((b) => b.customerId === customerId)).pipe(delay(200));
  }

  markReviewed(bookingId: string): void {
    const b = this.bookings.find((b) => b.id === bookingId);
    if (b) b.reviewed = true;
  }
}
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
