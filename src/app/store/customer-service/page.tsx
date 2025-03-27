'use client';

import { useState } from 'react';

interface Inquiry {
  id: string;
  storeName: string;
  storeId: string;
  type: 'question' | 'system' | 'operation' | 'payment';
  title: string;
  content: string;
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  answer?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'operation' | 'system' | 'payment';
}

export default function CustomerServicePage() {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'faq' | 'write'>('inquiries');
  const [newInquiry, setNewInquiry] = useState({
    title: '',
    type: 'question' as Inquiry['type'],
    content: ''
  });

  // 예시 문의 데이터
  const [inquiries] = useState<Inquiry[]>([
    {
      id: 'INQ-001',
      storeName: '도넛캠프 강남점',
      storeId: 'STORE-001',
      type: 'system',
      title: 'POS 시스템 오류 문의',
      content: '오늘 오후 2시부터 POS 시스템에서 주문이 들어오지 않는 문제가 발생했습니다. 확인 부탁드립니다.',
      status: 'completed',
      createdAt: '2024-03-20 14:30',
      answer: '시스템 점검을 완료했습니다. 현재는 정상 작동하는 것을 확인했습니다. 추가 문제가 있다면 다시 문의해 주세요.'
    },
    {
      id: 'INQ-002',
      storeName: '도넛캠프 강남점',
      storeId: 'STORE-001',
      type: 'operation',
      title: '메뉴 품절 처리 방법 문의',
      content: '재료 소진으로 일부 메뉴를 품절 처리하고 싶은데 어떻게 해야 하나요?',
      status: 'pending',
      createdAt: '2024-03-20 13:20'
    }
  ]);

  // FAQ 데이터
  const faqs: FAQ[] = [
    {
      id: 'FAQ-001',
      question: 'POS 시스템 점검 시간은 언제인가요?',
      answer: '매주 수요일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다. 점검 시간에는 주문이 일시적으로 중단될 수 있습니다.',
      category: 'system'
    },
    {
      id: 'FAQ-002',
      question: '매장 운영 매뉴얼은 어디서 확인할 수 있나요?',
      answer: "스토어 포털의 '매장 운영 가이드' 메뉴에서 확인하실 수 있습니다. 매뉴얼은 정기적으로 업데이트됩니다.",
      category: 'operation'
    },
    {
      id: 'FAQ-003',
      question: '매장 정산일은 언제인가요?',
      answer: "매월 1일과 16일에 정산이 진행됩니다. 정산 내역은 스토어 포털의 '정산 관리' 메뉴에서 확인하실 수 있습니다.",
      category: 'payment'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 문의 등록 API 호출
    alert('문의가 등록되었습니다.');
    setNewInquiry({ title: '', type: 'question', content: '' });
    setActiveTab('inquiries');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-4 flex items-center">
        <button onClick={() => window.history.back()} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-medium text-center flex-1">고객센터</h1>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 py-4 relative border-b-2 ${
            activeTab === 'inquiries' 
              ? 'text-[#FF7355] border-[#FF7355] bg-white' 
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-base font-medium">1:1 문의</div>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-4 relative border-b-2 ${
            activeTab === 'faq' 
              ? 'text-[#FF7355] border-[#FF7355] bg-white' 
              : 'text-gray-500 border-transparent hover:bg-gray-50'
          }`}
        >
          <div className="text-base font-medium">자주 묻는 질문</div>
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4">
        {activeTab === 'inquiries' && (
          <>
            <button
              onClick={() => setActiveTab('write')}
              className="w-full mb-4 px-4 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344] font-medium"
            >
              문의하기
            </button>
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100">
                      {inquiry.type === 'system' ? '시스템' :
                       inquiry.type === 'operation' ? '운영' :
                       inquiry.type === 'payment' ? '정산' : '문의'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      inquiry.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status === 'pending' ? '답변 대기' :
                       inquiry.status === 'inProgress' ? '답변 중' : '답변 완료'}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{inquiry.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{inquiry.createdAt}</p>
                  <p className="text-gray-700 mb-4">{inquiry.content}</p>
                  {inquiry.answer && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-gray-700">{inquiry.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    카테고리: {faq.category === 'general' ? '일반' :
                             faq.category === 'operation' ? '운영' :
                             faq.category === 'system' ? '시스템' : '정산'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'write' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
              <select
                value={newInquiry.type}
                onChange={(e) => setNewInquiry({ ...newInquiry, type: e.target.value as Inquiry['type'] })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              >
                <option value="question">일반 문의</option>
                <option value="system">시스템</option>
                <option value="operation">운영</option>
                <option value="payment">정산</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={newInquiry.title}
                onChange={(e) => setNewInquiry({ ...newInquiry, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                value={newInquiry.content}
                onChange={(e) => setNewInquiry({ ...newInquiry, content: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] min-h-[200px]"
                placeholder="문의 내용을 입력해주세요"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
              >
                등록하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 