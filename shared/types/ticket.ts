export type TicketLineItem = {
  name: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
};

export type TicketExtraction = {
  merchant: string | null;
  purchaseDate: string | null;
  currency: string | null;
  total: number | null;
  subtotal: number | null;
  tax: number | null;
  tip: number | null;
  invoiceNumber: string | null;
  paymentMethod: string | null;
  items: TicketLineItem[];
  notes: string[];
};
