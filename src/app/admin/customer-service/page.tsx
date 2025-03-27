'use client';

import { useState } from 'react';

interface CustomerInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  type: 'order' | 'delivery' | 'product' | 'etc';
  title: string;
  content: string;
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  answer?: string;
}

interface StoreInquiry {
  id: string;
  storeName: string;
  storeId: string;
  type: 'system' | 'operation' | 'payment';
  title: string;
  content: string;
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  answer?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AdminCustomerServicePage() {
  // 현재 선택된 문의 유형 (고객/스토어)
  const [activeTab, setActiveTab] = useState<'customer' | 'store'>('customer');
  // 현재 선택된 상태
  const [activeStatus, setActiveStatus] = useState<'pending' | 'inProgress' | 'completed'>('pending');
  // 선택된 문의
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | StoreInquiry | null>(null);
  // 답변 텍스트
  const [answerText, setAnswerText] = useState('');

  // 예시 고객 문의 데이터
  const [customerInquiries, setCustomerInquiries] = useState<CustomerInquiry[]>([
    {
      id: 'CUS-001',
      customerName: '김철수',
      customerPhone: '010-1234-5678',
      type: 'order',
      title: '주문 취소 문의',
      content: '방금 주문한 내역을 취소하고 싶습니다.',
      status: 'pending',
      createdAt: '2024-03-27 10:30'
    },
    {
      id: 'CUS-002',
      customerName: '이영희',
      customerPhone: '010-9876-5432',
      type: 'delivery',
      title: '픽업 시간 변경 가능한가요?',
      content: '픽업 시간을 30분 늦출 수 있을까요?',
      status: 'inProgress',
      createdAt: '2024-03-27 09:15'
    }
  ]);

  // 예시 스토어 문의 데이터
  const [storeInquiries, setStoreInquiries] = useState<StoreInquiry[]>([
    {
      id: 'STR-001',
      storeName: '도넛캠프 강남점',
      storeId: 'STORE-001',
      type: 'system',
      title: 'POS 시스템 오류',
      content: '주문 접수가 되지 않습니다.',
      status: 'pending',
      createdAt: '2024-03-27 14:30',
      priority: 'high'
    },
    {
      id: 'STR-002',
      storeName: '도넛캠프 홍대점',
      storeId: 'STORE-002',
      type: 'operation',
      title: '메뉴 품절 처리 방법',
      content: '재료 소진으로 일부 메뉴 품절 처리가 필요합니다.',
      status: 'inProgress',
      createdAt: '2024-03-27 13:20',
      priority: 'medium'
    }
  ]);

  // 문의 상태 변경
  const updateInquiryStatus = (inquiryId: string, newStatus: 'pending' | 'inProgress' | 'completed') => {
    if (activeTab === 'customer') {
      setCustomerInquiries(inquiries =>
        inquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
      );
    } else {
      setStoreInquiries(inquiries =>
        inquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
      );
    }
  };

  // 답변 등록
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !answerText.trim()) return;

    if (activeTab === 'customer') {
      setCustomerInquiries(inquiries =>
        inquiries.map(inquiry =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, answer: answerText, status: 'completed' }
            : inquiry
        )
      );
    } else {
      setStoreInquiries(inquiries =>
        inquiries.map(inquiry =>
          inquiry.id === selectedInquiry.id
            ? { ...inquiry, answer: answerText, status: 'completed' }
            : inquiry
        )
      );
    }
    
    setAnswerText('');
    setSelectedInquiry(null);
  };

  // 현재 상태의 문의 목록
  const currentInquiries = activeTab === 'customer' 
    ? customerInquiries.filter(inquiry => inquiry.status === activeStatus)
    : storeInquiries.filter(inquiry => inquiry.status === activeStatus);

  // 우선순위 색상 (스토어 문의용)
  const getPriorityColor = (priority: StoreInquiry['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 문의 유형 탭 */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => {
            setActiveTab('customer');
            setActiveStatus('pending');
          }}
          className={`flex-1 py-4 px-4 text-center relative ${
            activeTab === 'customer'
              ? 'text-[#FF7355] border-b-2 border-[#FF7355]'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          고객 문의
        </button>
        <button
          onClick={() => {
            setActiveTab('store');
            setActiveStatus('pending');
          }}
          className={`flex-1 py-4 px-4 text-center relative ${
            activeTab === 'store'
              ? 'text-[#FF7355] border-b-2 border-[#FF7355]'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          스토어 문의
        </button>
      </div>

      {/* 상태 탭 */}
      <div className="flex border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveStatus('pending')}
          className={`flex-1 py-4 relative border-b-2 ${
            activeStatus === 'pending'
              ? 'text-[#FF7355] border-[#FF7355] bg-white'
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-base font-medium">답변 대기</div>
          <div className="text-sm text-gray-500">
            {(activeTab === 'customer' 
              ? customerInquiries 
              : storeInquiries
            ).filter(i => i.status === 'pending').length}건
          </div>
        </button>
        <button
          onClick={() => setActiveStatus('inProgress')}
          className={`flex-1 py-4 relative border-b-2 ${
            activeStatus === 'inProgress'
              ? 'text-[#FF7355] border-[#FF7355] bg-white'
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-base font-medium">답변 중</div>
          <div className="text-sm text-gray-500">
            {(activeTab === 'customer'
              ? customerInquiries
              : storeInquiries
            ).filter(i => i.status === 'inProgress').length}건
          </div>
        </button>
        <button
          onClick={() => setActiveStatus('completed')}
          className={`flex-1 py-4 relative border-b-2 ${
            activeStatus === 'completed'
              ? 'text-[#FF7355] border-[#FF7355] bg-white'
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-base font-medium">답변 완료</div>
          <div className="text-sm text-gray-500">
            {(activeTab === 'customer'
              ? customerInquiries
              : storeInquiries
            ).filter(i => i.status === 'completed').length}건
          </div>
        </button>
      </div>

      {/* 문의 목록 */}
      <div className="p-4">
        <div className="space-y-4">
          {currentInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  {'priority' in inquiry && (
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(inquiry.priority)}`}>
                      {inquiry.priority === 'high' ? '긴급' :
                       inquiry.priority === 'medium' ? '보통' : '일반'}
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100">
                    {inquiry.type === 'system' ? '시스템' :
                     inquiry.type === 'operation' ? '운영' :
                     inquiry.type === 'payment' ? '정산' :
                     inquiry.type === 'order' ? '주문' :
                     inquiry.type === 'delivery' ? '픽업' :
                     inquiry.type === 'product' ? '상품' : '기타'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{inquiry.createdAt}</span>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">{inquiry.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  {'customerName' in inquiry ? (
                    <>
                      <span>{inquiry.customerName}</span>
                      <span>•</span>
                      <span>{inquiry.customerPhone}</span>
                    </>
                  ) : (
                    <>
                      <span>{inquiry.storeName}</span>
                      <span>•</span>
                      <span>{inquiry.storeId}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-700">{inquiry.content}</p>
              </div>
              {inquiry.answer ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">답변</h4>
                  <p className="text-gray-700">{inquiry.answer}</p>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      updateInquiryStatus(inquiry.id, 'inProgress');
                      setSelectedInquiry(inquiry);
                    }}
                    className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                  >
                    답변하기
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 답변 모달 */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="bg-[#FF7355] px-4 py-4 flex items-center justify-between">
              <h2 className="text-white text-lg font-medium">답변 작성</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">{selectedInquiry.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  {'customerName' in selectedInquiry ? (
                    <>
                      <span>{selectedInquiry.customerName}</span>
                      <span>•</span>
                      <span>{selectedInquiry.customerPhone}</span>
                    </>
                  ) : (
                    <>
                      <span>{selectedInquiry.storeName}</span>
                      <span>•</span>
                      <span>{selectedInquiry.storeId}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{selectedInquiry.createdAt}</span>
                </div>
                <p className="text-gray-700">{selectedInquiry.content}</p>
              </div>
              <form onSubmit={handleSubmitAnswer}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">답변 내용</label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] min-h-[200px]"
                    placeholder="답변 내용을 입력해주세요"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
                  >
                    답변 등록
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 