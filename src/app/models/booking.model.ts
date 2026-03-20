export interface Booking {
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
}
