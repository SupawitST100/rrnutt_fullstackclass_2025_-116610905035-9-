export interface Booking {
<<<<<<< HEAD
  id: number;
  customer_id: number;
  customer_name?: string;
  total_amount: number;
  status: 'Pending' | 'Paid' | 'Cancelled';
  booking_date: string;
  items?: BookingItem[];
}

export interface BookingItem {
  id: number;
  booking_id: number;
  item_type: 'Package' | 'Flight' | 'Hotel';
  item_id: number;
  item_name?: string;
  quantity: number;
  price_at_booking: number;
=======
  id: string;
  customerId: string;
  destinationId: string;
  destinationName: string;
  destinationFlag: string;
  destinationCountry: string;
  travelDate: Date;
  reviewed: boolean;
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
}
