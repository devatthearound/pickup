'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export default function LinksPage() {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState<SocialLink>({
    id: '',
    platform: '',
    url: '',
  });

  const addSocialLink = () => {
    if (newLink.platform && newLink.url) {
      setSocialLinks([...socialLinks, { ...newLink, id: Date.now().toString() }]);
      setNewLink({ id: '', platform: '', url: '' });
    }
  };

  const handleSave = () => {
    // 여기에 저장 로직이 들어갑니다
    console.log({ socialLinks });
    router.push('/store');
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">도넛캠프 - 링크 관리</h1>
      </div>

      {/* 컨텐츠 */}
      <div className="p-6 pb-24">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">새로운 링크 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">플랫폼</label>
                <input
                  type="text"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  placeholder="예: Instagram"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                />
              </div>
              <button
                onClick={addSocialLink}
                className="w-full py-2 border border-[#FF7355] text-[#FF7355] rounded-lg font-medium hover:bg-[#FFF0ED] transition-colors"
              >
                링크 추가
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {socialLinks.map((link) => (
              <div key={link.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-medium">{link.platform}</div>
                <div className="text-sm text-blue-500 mt-1">{link.url}</div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      const updatedLinks = socialLinks.filter(l => l.id !== link.id);
                      setSocialLinks(updatedLinks);
                    }}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
        >
          저장하기
        </button>
      </div>
    </div>
  );
} 