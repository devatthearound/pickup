'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';
import Link from 'next/link';

interface RegisterFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  first_name: string;
  last_name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const axiosInstance = useAxios();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 비밀번호 요구사항 검증 함수 추가
  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, message: "8자 이상" },
      { regex: /[A-Z]/, message: "대문자 포함" },
      { regex: /[a-z]/, message: "소문자 포함" },
      { regex: /[0-9]/, message: "숫자 포함" },
      { regex: /[!@#$%^&*]/, message: "특수문자 포함" }
    ];

    return requirements.map(req => ({
      met: req.regex.test(password),
      message: req.message
    }));
  };

  // 비밀번호 입력 필드 수정을 위한 핸들러 수정
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // handleSubmit 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', 
        {
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: 'owner'
        });

      const data = await response.data;

      if (response.status !== 201) {
        throw new Error(data.message || '회원가입 중 오류가 발생했습니다.');
      }

      router.push('/bizes/login?registered=true');
    } catch (error: any) {
      // API 에러 응답 구조에 맞게 에러 메시지 처리
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.message 
        || '회원가입 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 요구사항 상태 계산
  const passwordRequirements = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-[#FF7355] px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-xl font-medium">사장님 계정 만들기</h1>
          <p className="text-white/80 text-sm mt-1">
            스토어 관리를 위한 사장님 계정을 만들어보세요
          </p>
        </div>
      </div>

      {/* 진행 상태 표시 */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="relative flex items-center justify-between">
          {/* 배경 프로그레스 바 */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
          
          {/* 활성 프로그레스 바 */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#FF7355] -translate-y-1/2 transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {/* 스텝 표시 */}
          {[...Array(totalSteps)].map((_, index) => (
            <div key={index} className="relative z-10 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  index + 1 <= currentStep
                    ? 'bg-[#FF7355] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="max-w-md mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Step 1: 기본 정보 */}
            {currentStep === 1 && (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      성
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      placeholder="성"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      placeholder="이름"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    placeholder="010-0000-0000"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Step 2: 이메일 */}
            {currentStep === 2 && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 주소
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                  placeholder="이메일 주소"
                  disabled={loading}
                />
              </div>
            )}

            {/* Step 3: 비밀번호 */}
            {currentStep === 3 && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    placeholder="비밀번호"
                    disabled={loading}
                  />
                  {/* 비밀번호 요구사항 표시 */}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center text-sm ${
                          req.met ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {req.met ? (
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {req.message}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    required
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    placeholder="비밀번호 확인"
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-4 px-4 rounded-lg text-[#FF7355] font-medium border-2 border-[#FF7355] hover:bg-[#FF7355] hover:text-white transition-colors"
              >
                이전
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-4 px-4 rounded-lg text-white font-medium bg-[#FF7355] hover:bg-[#FF6344]"
              >
                다음
              </button>
            ) : (
              <button
                type="submit"
                className={`flex-1 py-4 px-4 rounded-lg text-white font-medium ${
                  loading ? 'bg-[#FF7355]/50 cursor-not-allowed' : 'bg-[#FF7355] hover:bg-[#FF6344]'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    계정 생성 중...
                  </span>
                ) : (
                  '계정 만들기'
                )}
              </button>
            )}
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/bizes/login" className="font-medium text-[#FF7355] hover:text-[#FF6344]">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 