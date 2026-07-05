import { getSupabase, isConfigured } from './supabase';
import { Product, Customer, Order, OrderStatus } from '../types';
// @ts-ignore
import headphoneImg from '../assets/images/regenerated_image_1783235508742.jpg';

const DEFAULT_PRODUCT: Product = {
  id: 'aerosound-x1',
  name: 'AeroSound X1 Wireless Headphones',
  price: 2499,
  image_url: headphoneImg,
  description: 'Experience absolute sonic purity. The AeroSound X1 combines state-of-the-art hybrid Active Noise Cancellation with custom-tuned 40mm dynamic drivers to deliver an immersive, studio-grade listening experience.',
  stock_quantity: 125,
  specs: {
    battery_life: 'Up to 45 hours (ANC off) / 30 hours (ANC on)',
    driver_size: '40mm High-Resolution Dynamic Drivers',
    connectivity: 'Bluetooth 5.3 & Ultra-Low Latency USB-C Audio',
    noise_cancelling: 'Hybrid Active Noise Cancelling (up to -42dB)',
    weight: '250g Ultra-Comfort Design'
  }
};

// Seed Mock Data for Demo mode if empty
const initDemoData = () => {
  const existingProduct = localStorage.getItem('as_product');
  if (!existingProduct || JSON.parse(existingProduct).image_url.includes('unsplash.com')) {
    localStorage.setItem('as_product', JSON.stringify(DEFAULT_PRODUCT));
  } else {
    const parsed = JSON.parse(existingProduct);
    if (parsed.image_url !== headphoneImg) {
      parsed.image_url = headphoneImg;
      localStorage.setItem('as_product', JSON.stringify(parsed));
    }
  }
  if (!localStorage.getItem('as_customers')) {
    const defaultCustomers: Customer[] = [
      {
        id: 'cust-1',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@example.com',
        phone: '+91 98765 43210',
        address: 'Flat 402, Sunset Heights, Bandra West, Mumbai, Maharashtra - 400050',
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'cust-2',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 99988 77766',
        address: 'Sector 15, H.No. 452, Gurugram, Haryana - 122001',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'cust-3',
        name: 'Rohan Das',
        email: 'rohan.das@example.com',
        phone: '+91 88877 66655',
        address: '12/A, Park Street, Kolkata, West Bengal - 700016',
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem('as_customers', JSON.stringify(defaultCustomers));
  }
  if (!localStorage.getItem('as_orders')) {
    const defaultOrders: Order[] = [
      {
        id: 'ORD-984102',
        customer_id: 'cust-1',
        product_id: 'aerosound-x1',
        quantity: 1,
        total_amount: 2499,
        status: 'shipped',
        payment_method: 'cod',
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'ORD-105234',
        customer_id: 'cust-2',
        product_id: 'aerosound-x1',
        quantity: 2,
        total_amount: 4998,
        status: 'pending',
        payment_method: 'cod',
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: 'ORD-775612',
        customer_id: 'cust-3',
        product_id: 'aerosound-x1',
        quantity: 1,
        total_amount: 2499,
        status: 'pending',
        payment_method: 'cod',
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
      }
    ];
    localStorage.setItem('as_orders', JSON.stringify(defaultOrders));
  }
};

if (typeof window !== 'undefined') {
  initDemoData();
}

export const storeService = {
  // Check whether we're in Demo mode
  isDemoMode() {
    return !isConfigured;
  },

  // 1. PRODUCTS
  async getProduct(): Promise<Product> {
    const supabase = getSupabase();
    if (!supabase) {
      const stored = localStorage.getItem('as_product');
      return stored ? JSON.parse(stored) : DEFAULT_PRODUCT;
    }

    try {
      // Fetch the first product
      const { data, error } = await (supabase.from('products') as any)
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // If table exists but is empty, try to seed a single row
        const { data: inserted, error: insertError } = await (supabase.from('products') as any)
          .insert([DEFAULT_PRODUCT])
          .select()
          .single();

        if (insertError) {
          console.warn('Could not seed product in Supabase:', insertError);
          return DEFAULT_PRODUCT;
        }
        return inserted as any;
      }

      return data as Product;
    } catch (err) {
      console.error('Error fetching product from Supabase:', err);
      // Fallback to default in case of issues
      return DEFAULT_PRODUCT;
    }
  },

  // 2. CUSTOMERS & ORDERS (CHECKOUT FLOW)
  async placeOrder(orderData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    quantity: number;
    totalAmount: number;
    productId: string;
  }): Promise<{ orderId: string }> {
    const supabase = getSupabase();
    const referenceNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    if (!supabase) {
      // Demo Mode Write
      const customers: Customer[] = JSON.parse(localStorage.getItem('as_customers') || '[]');
      const orders: Order[] = JSON.parse(localStorage.getItem('as_orders') || '[]');

      // Find or create customer
      let customer = customers.find(c => c.email.toLowerCase() === orderData.email.toLowerCase());
      if (!customer) {
        customer = {
          id: 'cust-' + Math.floor(1000 + Math.random() * 9000),
          name: orderData.name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          created_at: new Date().toISOString()
        };
        customers.push(customer);
        localStorage.setItem('as_customers', JSON.stringify(customers));
      } else {
        // Update contact info in case it changed
        customer.name = orderData.name;
        customer.phone = orderData.phone;
        customer.address = orderData.address;
        localStorage.setItem('as_customers', JSON.stringify(customers));
      }

      // Create Order
      const newOrder: Order = {
        id: referenceNumber,
        customer_id: customer.id,
        product_id: orderData.productId,
        quantity: orderData.quantity,
        total_amount: orderData.totalAmount,
        status: 'pending',
        payment_method: 'cod',
        created_at: new Date().toISOString()
      };

      orders.unshift(newOrder);
      localStorage.setItem('as_orders', JSON.stringify(orders));

      // Adjust mock stock
      const product = await this.getProduct();
      product.stock_quantity = Math.max(0, product.stock_quantity - orderData.quantity);
      localStorage.setItem('as_product', JSON.stringify(product));

      return { orderId: referenceNumber };
    }

    // Real Supabase Write
    try {
      // 1. Try to find customer by email
      const { data: existingCustomer, error: custSearchError } = await (supabase.from('customers') as any)
        .select('*')
        .eq('email', orderData.email.trim())
        .maybeSingle();

      if (custSearchError) throw custSearchError;

      let customerId = '';
      if (existingCustomer) {
        customerId = (existingCustomer as any).id;
        // Optionally update details
        await (supabase.from('customers') as any)
          .update({
            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address
          })
          .eq('id', customerId);
      } else {
        // Create new customer
        const { data: newCust, error: custInsertError } = await (supabase.from('customers') as any)
          .insert([{
            name: orderData.name,
            email: orderData.email.trim(),
            phone: orderData.phone,
            address: orderData.address
          }])
          .select()
          .single();

        if (custInsertError) throw custInsertError;
        customerId = (newCust as any).id;
      }

      // 2. Insert order
      const { data: newOrder, error: orderInsertError } = await (supabase.from('orders') as any)
        .insert([{
          customer_id: customerId,
          product_id: orderData.productId,
          quantity: orderData.quantity,
          total_amount: orderData.totalAmount,
          status: 'pending',
          payment_method: 'cod'
        }])
        .select()
        .single();

      if (orderInsertError) throw orderInsertError;

      // 3. Try to decrement stock (non-blocking)
      try {
        const currentProd = await this.getProduct();
        await (supabase.from('products') as any)
          .update({ stock_quantity: Math.max(0, currentProd.stock_quantity - orderData.quantity) })
          .eq('id', orderData.productId);
      } catch (stockErr) {
        console.warn('Could not update stock:', stockErr);
      }

      return { orderId: (newOrder as any).id };
    } catch (err) {
      console.error('Error in placeOrder on Supabase:', err);
      throw err;
    }
  },

  // 3. ADMIN AUTHENTICATION
  async loginAdmin(email: string, password: string): Promise<{ success: boolean; session?: any; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      // Demo Mode login: admin@example.com / admin123
      if (email.trim().toLowerCase() === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('as_admin_logged_in', 'true');
        return { success: true };
      }
      return { success: false, error: 'Invalid admin credentials for Demo mode (use admin@example.com with password admin123)' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Authentication failed');

      // Check whitelist
      const { data: adminRecord, error: whitelistError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (whitelistError) {
        await supabase.auth.signOut();
        throw whitelistError;
      }

      if (!adminRecord) {
        // User exists but is not an approved admin whitelisted in the admins table
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: Your account is not whitelisted in the admins table.'
        };
      }

      return { success: true, session: data.session };
    } catch (err: any) {
      console.error('Error logging in admin:', err);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  },

  async logoutAdmin(): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) {
      localStorage.removeItem('as_admin_logged_in');
      return;
    }
    await supabase.auth.signOut();
  },

  async checkAdminSession(): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) {
      return localStorage.getItem('as_admin_logged_in') === 'true';
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return false;

      const { data: adminRecord } = await (supabase.from('admins') as any)
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return !!adminRecord;
    } catch {
      return false;
    }
  },

  // 4. ADMIN DASHBOARD - ORDERS
  async getAdminOrders(): Promise<Order[]> {
    const supabase = getSupabase();
    if (!supabase) {
      const orders: Order[] = JSON.parse(localStorage.getItem('as_orders') || '[]');
      const customers: Customer[] = JSON.parse(localStorage.getItem('as_customers') || '[]');
      const product = await this.getProduct();

      return orders.map(order => ({
        ...order,
        customer: customers.find(c => c.id === order.customer_id),
        product
      }));
    }

    try {
      const { data, error } = await (supabase.from('orders') as any)
        .select(`
          *,
          customer:customers(*),
          product:products(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    } catch (err) {
      console.error('Error fetching orders:', err);
      throw err;
    }
  },

  // 5. ADMIN DASHBOARD - CUSTOMERS WITH ORDERS COUNT
  async getAdminCustomers(): Promise<Customer[]> {
    const supabase = getSupabase();
    if (!supabase) {
      const customers: Customer[] = JSON.parse(localStorage.getItem('as_customers') || '[]');
      const orders: Order[] = JSON.parse(localStorage.getItem('as_orders') || '[]');

      return customers.map(cust => {
        const customerOrders = orders.filter(o => o.customer_id === cust.id);
        return {
          ...cust,
          orders_count: customerOrders.length
        };
      });
    }

    try {
      // Fetch all customers and all orders to compute counts (simple for single-product small scale store)
      const { data: customers, error: custErr } = await (supabase.from('customers') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (custErr) throw custErr;

      const { data: orders, error: ordErr } = await (supabase.from('orders') as any)
        .select('customer_id');

      if (ordErr) throw ordErr;

      const orderCountByCust: Record<string, number> = {};
      (orders as any[]).forEach(o => {
        if (o.customer_id) {
          orderCountByCust[o.customer_id] = (orderCountByCust[o.customer_id] || 0) + 1;
        }
      });

      return (customers as Customer[]).map(c => ({
        ...c,
        orders_count: orderCountByCust[c.id] || 0
      }));
    } catch (err) {
      console.error('Error fetching customers:', err);
      throw err;
    }
  },

  // 6. UPDATE ORDER STATUS
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) {
      const orders: Order[] = JSON.parse(localStorage.getItem('as_orders') || '[]');
      const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('as_orders', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await (supabase.from('orders') as any)
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  }
};
