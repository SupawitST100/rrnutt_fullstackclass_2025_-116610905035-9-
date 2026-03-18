export interface Booking {
  id: string;
  customerId: string;
  destinationId: string;
  destinationName: string;
  destinationFlag: string;
  destinationCountry: string;
  travelDate: Date;
  reviewed: boolean;
}
