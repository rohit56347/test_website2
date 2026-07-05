export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  specs: {
    battery_life: string;
    driver_size: string;
    connectivity: string;
    noise_cancelling: string;
    weight: string;
    [key: string]: string;
  };
  created_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  // Computed property for admin dashboard view
  orders_count?: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: 'cod';
  created_at: string;
  // Populated in joined queries
  customer?: Customer;
  product?: Product;
}

export interface Admin {
  id: string;
  created_at: string;
}
