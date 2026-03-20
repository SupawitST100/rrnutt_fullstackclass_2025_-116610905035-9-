export interface Review {
  id: number;
  customer_id: number;
  customer_name?: string;
  item_type: 'Package' | 'Hotel';
  item_id: number;
  item_name?: string;
  rating: number;
  comment: string;
  created_at: string;
}
