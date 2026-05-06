export interface AdminOrder {
  id: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  date: string;
  estimatedDeliveryDate?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}
