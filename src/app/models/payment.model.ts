export interface Payment {
  id: number;
  booking_id: number;
  payment_method: 'Credit Card' | 'PromptPay';
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  transaction_date: string;
}
