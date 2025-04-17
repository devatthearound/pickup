export enum OrderStatus {
  PENDING = 'pending',
  // ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  // CANCELED = 'canceled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
} 

export interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    status: OrderStatus;
    totalAmount: string;
    finalAmount: string;
    paymentStatus: PaymentStatus;
    pickupTime: string;
    createdAt: string;
    orderItems: OrderItem[];
  }
  
  interface OrderItem {
    id: number;
    menuItemId: number;
    menuItem: {
      id: number;
      name: string;
      price: string;
      discountedPrice: string;
      imageUrl: string | null;
    };
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    specialInstructions: string;
    options: any[];
  }
  