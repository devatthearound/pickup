import { io } from 'socket.io-client';

// Socket.IO 클라이언트 인스턴스 생성
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
  autoConnect: true,
});

// 실시간 이벤트 타입 정의
export interface RealtimeEvent {
  type: 'order' | 'inquiry';
  action: 'create' | 'update' | 'delete';
  data: any;
}

// 주문 데이터 타입
export interface Order {
  id: string;
  orderNumber: string;
  orderCode: string;
  storeName: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime: string;
  orderedAt: string;
  region: string;
}

// 문의 데이터 타입
export interface Inquiry {
  id: string;
  storeId: string;
  storeName: string;
  type: 'system' | 'operation' | 'settlement';
  title: string;
  content: string;
  status: 'waiting' | 'inProgress' | 'completed';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

// 실시간 이벤트 리스너 등록 함수
export const subscribeToEvents = (
  onOrder: (data: Order) => void,
  onInquiry: (data: Inquiry) => void
) => {
  // 새로운 주문 이벤트
  socket.on('newOrder', (order: Order) => {
    onOrder(order);
  });

  // 주문 상태 업데이트 이벤트
  socket.on('orderUpdate', (order: Order) => {
    onOrder(order);
  });

  // 새로운 문의 이벤트
  socket.on('newInquiry', (inquiry: Inquiry) => {
    onInquiry(inquiry);
  });

  // 문의 상태 업데이트 이벤트
  socket.on('inquiryUpdate', (inquiry: Inquiry) => {
    onInquiry(inquiry);
  });

  return () => {
    socket.off('newOrder');
    socket.off('orderUpdate');
    socket.off('newInquiry');
    socket.off('inquiryUpdate');
  };
}; 