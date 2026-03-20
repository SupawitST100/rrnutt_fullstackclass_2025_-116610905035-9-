export interface TourPackage {
  id: number;
  dest_id: number;
  destination_name?: string;
  destination_location?: string;
  title: string;
  price: number;
  image_url: string;
  includes: string[];
  created_at?: string;
}
