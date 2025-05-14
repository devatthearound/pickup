'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAxios } from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { useUser } from '@/contexts/UserContext';
import { setCookie } from '@/lib/useCookie';

type CheckboxState = {
  age: boolean;
  terms: boolean;
  privacy: boolean;
  thirdParty: boolean;
  location: boolean;
  optionalInfo: boolean;
  marketing: boolean;
  precaution1: boolean;
  precaution2: boolean;
};
interface MenuItem {
  id: number;
  name: string;
  price: string;
  discountedPrice: string;
  description: string | null;
  imageUrl: string;
  categoryId: number;
  preparationTime: number | null;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isRecommended: boolean;
  stockQuantity: number | null;
}

interface CartItem extends MenuItem { 
  quantity: number;
}


export default function PersonalInfoPage() {
  const router = useRouter();

  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const axiosInstance = useAxios();


  const { user, fetchUser } = useUser();
const [allChecked, setAllChecked] = useState(false);
const [showLoginModal, setShowLoginModal] = useState(false);
const [email, setEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');
const [checkboxes, setCheckboxes] = useState<CheckboxState>({
  age: false,
  terms: false,
  privacy: false,
  thirdParty: false,
  location: false,
  optionalInfo: false,
  marketing: false,
  precaution1: false,
  precaution2: false,
});

const [username, setUsername] = useState('조현주');
const [phone, setPhone] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [showSignup, setShowSignup] = useState(true);
const [signupError, setSignupError] = useState<string | null>(null);
const [isSignupLoading, setIsSignupLoading] = useState(false);
const [isSendingCode, setIsSendingCode] = useState(false);
const [verificationCode, setVerificationCode] = useState('');
const [isVerifying, setIsVerifying] = useState(false);
const [isPhoneVerified, setIsPhoneVerified] = useState(false);
const [verificationError, setVerificationError] = useState<string | null>(null);
const [verificationSuccess, setVerificationSuccess] = useState(false);
const errorRef = useRef<HTMLDivElement>(null);
const [passwordError, setPasswordError] = useState<string | null>(null);
const [isPasswordValid, setIsPasswordValid] = useState(false);
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [totalAmount, setTotalAmount] = useState(0);


useEffect(() => {
  const loadCartData = () => {
    if (typeof window !== 'undefined') {
      const currentStoreId = localStorage.getItem('currentStoreId');
      if (currentStoreId) {
        setStoreId(currentStoreId);
        const savedCart = localStorage.getItem(`cart_${currentStoreId}`);
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
          
          const total = items.reduce((sum: number, item: CartItem) => {
            const price = item.discountedPrice !== item.price 
              ? parseInt(item.discountedPrice) 
              : parseInt(item.price);
            return sum + (price * item.quantity);
          }, 0);
          setTotalAmount(total);
        }
      } else {
        setTimeout(() => {
          router.back();
        }, 100);
      }
    }
  };

  loadCartData();
}, []);

  // 전체 동의 처리
  const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    
    const newCheckboxes: CheckboxState = {
        age: checked,
        terms: checked,
        privacy: checked,
        thirdParty: checked,
        location: checked,
        optionalInfo: checked,
        marketing: checked,
        precaution1: checked,
        precaution2: checked,
    };
    setCheckboxes(newCheckboxes);
  };

  // 개별 체크박스 처리
  const handleCheckbox = (name: keyof CheckboxState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckboxes = { ...checkboxes, [name]: e.target.checked };
    setCheckboxes(newCheckboxes);
    
    // 모든 체크박스가 선택되었는지 확인
    setAllChecked(Object.values(newCheckboxes).every(value => value));
  };

  // 회원가입 토글
  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post(`/auth/login2`, {
      identifier : email,
      password
    });

    if(res.status === 201) {
      console.log(res.data);
      setCookie('pu-atac', res.data.data.accessToken, {
        expires: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
      });
      setCookie('pu-atrf', res.data.data.refreshToken, {
        expires: new Date(new Date().setDate(new Date().getDate() + 14)),
      });
      fetchUser();
      setShowLoginModal(false);
      return true;
    }
    return false;
  }

  const scrollToError = () => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleSignup = useCallback(async () => {
    setSignupError(null);
    setIsSignupLoading(true);

    try {
      if (password !== confirmPassword) {
        setSignupError('비밀번호가 일치하지 않습니다.');
        setTimeout(scrollToError, 100);
        return;
      }

      const res = await axiosInstance.post(`/auth/register2`, {
        user_name: username,
        identifierType: 'phone',
        identifier: phone,
        password,
        role: 'customer'
      });

      if (res.data.success) {
        setCookie('pu-atac', res.data.data.accessToken, {
          expires: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
        });
        setCookie('pu-atrf', res.data.data.refreshToken, {
          expires: new Date(new Date().setDate(new Date().getDate() + 14)),
        });
        fetchUser();
        return true;
      } else {
        setSignupError(res.data.message || '회원가입에 실패했습니다.');
        setTimeout(scrollToError, 100);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
          if (errorMessage.includes('비밀번호 요구사항')) {
            console.log(errorMessage);

            setSignupError('비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.');
          } else {
            setSignupError(errorMessage);
          }
        } else if (error.response?.status === 409) {
          setSignupError('이미 존재하는 계정입니다.');
        } else if (error.response?.status === 400) {
          setSignupError('입력하신 정보를 확인해주세요.');
        } else {
          setSignupError('회원가입 중 오류가 발생했습니다.');
        }
        setTimeout(scrollToError, 100);
      } else {
        setSignupError('회원가입 중 오류가 발생했습니다.');
        setTimeout(scrollToError, 100);
      }
    } finally {
      setIsSignupLoading(false);
    }
  }, [username, phone, password, confirmPassword]);

  const handleLogin = async () => {
    const res = await login(email, loginPassword);
    if(res) {
      console.log('로그인 성공');
    }else{
      console.log('로그인 실패');
    }
  }

  // 전화번호 인증 코드 발송
  const handleSendVerificationCode = async () => {
    if (!phone || phone.length < 10) {
      setVerificationError('올바른 전화번호를 입력해주세요.');
      return;
    }

    try {
      setIsSendingCode(true);
      setVerificationError(null);
      
      const response = await axiosInstance.post('/auth/send-sms-code', {
        phone: phone.replace(/-/g, '')
      });

      if (response.status === 200) {
        alert('인증 코드가 발송되었습니다.');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setVerificationError(error.response?.data?.message || '인증 코드 발송에 실패했습니다.');
      } else {
        setVerificationError('인증 코드 발송에 실패했습니다.');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  // 전화번호 인증 코드 확인
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError('인증 코드를 입력해주세요.');
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationError(null);
      setVerificationSuccess(false);
      
      const response = await axiosInstance.post('/auth/verify-sms-code', {
        phone: phone.replace(/-/g, ''),
        code: verificationCode
      });

      if (response.status === 201) {
        setIsPhoneVerified(true);
        setVerificationSuccess(true);
        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          setVerificationSuccess(false);
        }, 3000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setVerificationError(error.response?.data?.message || '인증에 실패했습니다.');
      } else {
        setVerificationError('인증에 실패했습니다.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (!currentStoreId) {
      setError('가게 정보를 찾을 수 없습니다.');
      return;
    }

    setStoreId(currentStoreId);
  }, []);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const handleSugarRequest = (request: string) => {
    setSpecialInstructions(request);
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    } else if (phone.length === 10) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };


  const handleSubmit = async () => {
    setShowPhoneConfirm(false);
    setIsLoading(true);
    setError(null);

    try {
      const savedCart = localStorage.getItem(`cart_${storeId}`);
      if (!savedCart) {
        throw new Error('장바구니가 비어있습니다.');
      }

      const cartItems = JSON.parse(savedCart);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('장바구니가 비어있습니다.');
      }

      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        specialInstructions: specialInstructions
      }));

      const response = await axiosInstance.post('/orders',{
        storeDomain: storeId,
        items: orderItems,
        paymentMethod: 'cash'
      });

      if (response.status !== 201) {
        const errorData = await response.data;
        throw new Error(errorData.message || '주문 생성에 실패했습니다.');
      }

      const result = await response.data;
      
      if (!result.success || !result.data) {
        throw new Error('주문 응답이 올바르지 않습니다.');
      }
      
      localStorage.removeItem(`cart_${storeId}`);
      router.push(`/order/${result.data.orderNumber}`);

    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 401) {
        router.push('/bizes/login');
        return;
      }
      console.error('주문 에러:', error);
      setError('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 필수 약관 체크 여부 확인
  const isRequiredTermsChecked = useCallback(() => {
    return checkboxes.age && checkboxes.terms && checkboxes.privacy && 
           checkboxes.thirdParty && checkboxes.location;
  }, [checkboxes]);

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    // 영문, 숫자, 특수문자 중 2종류 이상 조합, 8-20자리
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 20;
    
    const typeCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (!isValidLength) {
      return '비밀번호는 8-20자리로 설정해주세요.';
    }
    
    if (typeCount < 2) {
      return '영문, 숫자, 특수문자 중 2종류 이상을 조합해주세요.';
    }

    if (!hasSpecial) {
      return '특수문자를 포함해주세요.';
    }
    
    return null;
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    const error = validatePassword(newPassword);
    setPasswordError(error);
    setIsPasswordValid(!error);
  };

  // 비밀번호 확인 변경 핸들러
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    
    if (newConfirmPassword !== password) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      setIsPasswordValid(false);
    } else {
      setPasswordError(null);
      setIsPasswordValid(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">장바구니가 비어있습니다</h2>
          <p className="text-gray-500 mt-2">메뉴를 추가해주세요</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF6344]"
          >
            메뉴 선택하기
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 bg-white">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold">주문자 정보</h1>
          </div>
        </div>
      </div>

      <div>
      {/* <div className="p-4">
        <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>• 주문은 가게 운영 상황에 따라 거절될 수 있습니다.</p>
          <p>• 주문 및 픽업 관련 알림은 알림톡으로 발송됩니다.</p>
        </div>
        </div> */}

 {/* 메인 콘텐츠 */}
 <main>
            
            {/* 예약 정보 섹션 */}
            <section className="my-5">
              <div className="px-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">예약 정보</h3>
                </div>
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {/* 예약자 정보 */}
                    {user && (
                      <div className="mb-4">
                        <h4 className="text-base font-medium mb-2">예약자 정보</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">이름: {user.name}</p>
                          <p className="text-sm text-gray-600">전화번호: {user.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* 장바구니 정보 */}
                    <div>
                      <h4 className="text-base font-medium mb-2">주문 메뉴</h4>
                      {cartItems && (
                            <div className="space-y-2">
                              {cartItems.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">
                                    {item.name} x {item.quantity}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {((item.discountedPrice !== item.price 
                                      ? parseInt(item.discountedPrice) 
                                      : parseInt(item.price)) * item.quantity).toLocaleString('ko-KR')}원
                                  </span>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-medium">총 금액</span>
                                  <span className="text-base font-bold">
                                    {totalAmount.toLocaleString('ko-KR')}원
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 요청사항 섹션 */}
            <section className="my-5">
              <div className="px-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">요청사항</h3>
                </div>
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div>
                      <textarea
                        id="specialInstructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                        placeholder="요청사항을 입력해주세요"
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleSugarRequest('설탕 많이')}
                          className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          설탕 많이
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSugarRequest('설탕 X')}
                          className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          설탕 X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {
                !user && (
            
            <div>

              {/* 로그인 섹션 */}
              <section className="pt-0 pb-0">
                <div className="px-4">
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => setShowLoginModal(true)}
                  >
                    <span className="text-lg font-bold">로그인하고 예약하기</span>
                    <span className="text-blue-500 font-bold">로그인</span>
                  </div>
                </div>
              </section>
              <hr className="h-2 bg-gray-100 border-none my-6" />
              
              {/* 회원가입 섹션 */}
              <section>
                <div className="px-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold">회원가입하며 예약하기</h3>
                    <div>
                      <a 
                        href="#" 
                        className="text-sm text-gray-600"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSignup();
                        }}
                      >
                        {showSignup ? '접기' : '더보기'}
                      </a>
                    </div>
                  </div>
                </div>
                
                {showSignup && (
                  <div>
                    <div>
                      <main style={{ paddingBottom: '0px' }}>
                        <section className="pt-2">
                          <div className="px-4">
                            {/* 이름 입력 폼 */}
                            <div className="mb-8">
                              <div className="mb-2">
                                <h3 className="text-base font-medium">이름 <span className="text-red-500">*</span></h3>
                              </div>
                              <div>
                                <div>
                                  <input 
                                    type="text" 
                                    name="userName" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-base" 
                                    placeholder="한글, 영문만 입력해 주세요." 
                                    autoComplete="nope" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">레스토랑을 예약할 때 사용할 이름이므로 꼭 실명을 사용해 주세요.</p>
                              </div>
                            </div>
                            
                            {/* 휴대폰 번호 입력 폼 */}
                            <div className="mb-8">
                              <div className="mb-2 flex items-center">
                                <h3 className="text-base font-medium">휴대폰 번호 <span className="text-red-500">*</span></h3>
                                {isPhoneVerified && (
                                  <span className="ml-2 text-sm text-green-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    인증완료
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="mb-2">
                                  <div className="flex gap-2 mb-2">
                                    <input 
                                      type="tel" 
                                      inputMode="tel" 
                                      className={`flex-1 px-4 py-3 border ${
                                        verificationError ? 'border-red-500' : 
                                        isPhoneVerified ? 'border-green-500' : 
                                        'border-gray-300'
                                      } rounded-md text-base transition-colors duration-200`}
                                      placeholder="숫자만 입력해 주세요." 
                                      autoComplete="nope" 
                                      value={phone}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setPhone(value);
                                        if (value.length >= 10) {
                                          setPhone(formatPhoneNumber(value));
                                        }
                                      }}
                                      disabled={isPhoneVerified}
                                    />
                                    <button 
                                      type="button" 
                                      onClick={handleSendVerificationCode}
                                      disabled={isSendingCode || isPhoneVerified || phone.length < 10}
                                      className={`w-28 h-12 rounded-md text-white font-bold transition-colors duration-200 ${
                                        isSendingCode || isPhoneVerified || phone.length < 10 
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                          : 'bg-red-500 hover:bg-red-600'
                                      }`}
                                    >
                                      {isSendingCode ? '발송 중...' : '인증번호 요청'}
                                    </button>
                                  </div>
                                  {verificationError && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {verificationError}
                                    </p>
                                  )}
                                  {verificationSuccess && (
                                    <p className="text-sm text-green-500 mt-1 flex items-center transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                      인증번호가 확인되었습니다.
                                    </p>
                                  )}
                                </div>
                                
                                {!isPhoneVerified && (
                                  <div className="flex gap-2">
                                    <input 
                                      type="text" 
                                      className={`flex-1 px-4 py-3 border ${
                                        verificationError ? 'border-red-500' : 
                                        verificationSuccess ? 'border-green-500' : 
                                        'border-gray-300'
                                      } rounded-md text-base transition-colors duration-200`}
                                      placeholder="인증번호 6자리 입력" 
                                      value={verificationCode}
                                      onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                      maxLength={6}
                                    />
                                    <button 
                                      type="button"
                                      onClick={handleVerifyCode}
                                      disabled={isVerifying || !verificationCode}
                                      className={`w-28 h-12 rounded-md text-white font-bold transition-colors duration-200 ${
                                        isVerifying || !verificationCode
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                          : 'bg-red-500 hover:bg-red-600'
                                      }`}
                                    >
                                      {isVerifying ? '확인 중...' : '확인'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* 비밀번호 입력 폼 */}
                            <div className="mb-8">
                              <div className="mb-2">
                                <h3 className="text-base font-medium">비밀번호 <span className="text-red-500">*</span></h3>
                              </div>
                              <div>
                                <div className="mb-2">
                                  <input 
                                    type="password" 
                                    name="userPassword" 
                                    className={`w-full px-4 py-3 border ${
                                      passwordError ? 'border-red-500' : 
                                      isPasswordValid ? 'border-green-500' : 
                                      'border-gray-300'
                                    } rounded-md text-base transition-colors duration-200`}
                                    placeholder="비밀번호를 입력해 주세요." 
                                    value={password}
                                    onChange={handlePasswordChange}
                                    aria-autocomplete="list" 
                                  />
                                </div>
                                <div>
                                  <input 
                                    type="password" 
                                    name="userPassword2" 
                                    className={`w-full px-4 py-3 border ${
                                      passwordError ? 'border-red-500' : 
                                      isPasswordValid ? 'border-green-500' : 
                                      'border-gray-300'
                                    } rounded-md text-base transition-colors duration-200`}
                                    placeholder="비밀번호를 다시 한 번 입력해 주세요."
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                  />
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8-20자리로 설정해주세요.
                                </p>
                                {passwordError && (
                                  <p className="text-sm text-red-500 mt-1 flex items-center transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {passwordError}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>
                        
                        {/* 예약 연동 설명 섹션 */}
                        {/* <section className="bg-gray-100 mb-8">
                          <div className="px-4 py-6">
                            <h4 className="text-xs text-gray-500 mb-2">예약 연동이란?</h4>
                            <ul className="list-disc pl-5 text-xs text-gray-500">
                              <li className="mb-1">전화 또는 예약 링크로 한 예약을 앱에서 관리할 수 있게 하는 기능입니다. 예약에 사용한 휴대폰 번호로 방문예정일을 불러올 수 있어요!</li>
                              <li className="mb-1">캐치테이블 가맹점 예약만 연동 가능하며,<br />연동하기 활성화 이전에 방문했던 전화 예약 내역은 불러올 수 없습니다.</li>
                              <li className="mb-1">전화 또는 예약 링크로 한 예약은 각 레스토랑의 운영 정책에 따라 앱에서 예약 취소 및 변경이 불가능할 수 있습니다.</li>
                              <li>예약 링크는 캐치테이블 가맹점을 예약할 수 있는 웹페이지 링크를 말합니다.</li>
                            </ul>
                          </div>
                        </section> */}
                        
                        {/* 이용자 약관 동의 섹션 */}
                        <section>
                          <div>
                            <div className="px-4">
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 mr-2" 
                                  autoComplete="nope" 
                                  checked={allChecked}
                                  onChange={handleAllCheck}
                                />
                                <span className="text-base font-bold">이용자 약관 전체 동의</span>
                              </label>
                              <hr className="h-px bg-gray-200 border-none my-4" />
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2" 
                                      autoComplete="nope"
                                      checked={checkboxes.age}
                                      onChange={handleCheckbox('age')}
                                    />
                                    <span className="text-sm font-medium">[필수] 만 14세 이상입니다.</span>
                                  </div>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2" 
                                      autoComplete="nope"
                                      checked={checkboxes.terms}
                                      onChange={handleCheckbox('terms')}
                                    />
                                    <span className="text-sm font-medium">[필수] 캐치테이블 이용약관 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2" 
                                      autoComplete="nope"
                                      checked={checkboxes.privacy}
                                      onChange={handleCheckbox('privacy')}
                                    />
                                    <span className="text-sm font-medium">[필수] 개인정보 수집 및 이용 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2"
                                      checked={checkboxes.thirdParty}
                                      onChange={handleCheckbox('thirdParty')}
                                    />
                                    <span className="text-sm font-medium">[필수] 개인정보 제3자 제공 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2" 
                                      autoComplete="nope"
                                      checked={checkboxes.location}
                                      onChange={handleCheckbox('location')}
                                    />
                                    <span className="text-sm font-medium">[필수] 위치정보 이용약관 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2" 
                                      autoComplete="nope"
                                      checked={checkboxes.optionalInfo}
                                      onChange={handleCheckbox('optionalInfo')}
                                    />
                                    <span className="text-sm font-medium">[선택] 개인정보 제공 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                              
                              <div>
                                <label className="flex justify-between items-center mb-4">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="w-5 h-5 mr-2"
                                      checked={checkboxes.marketing}
                                      onChange={handleCheckbox('marketing')}
                                    />
                                    <span className="text-sm font-medium">[선택] 마케팅 이용 동의</span>
                                  </div>
                                  <a href="#" className="text-sm text-gray-500">보기</a>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-4">
                            <button 
                                onClick={handleSignup}
                                disabled={isSignupLoading || !isRequiredTermsChecked() || !isPasswordValid}
                                className={`w-full h-12 bg-red-500 text-white font-bold rounded-md mt-10 transition-colors duration-200 ${
                                  isSignupLoading || !isRequiredTermsChecked() || !isPasswordValid
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-red-600'
                                }`}
                            >
                                {isSignupLoading ? '처리 중...' : '가입하기'}
                            </button>
                            {signupError && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {signupError}
                                </p>
                              </div>
                            )}
                          </div>
                        </section>
                      </main>
                    </div>
                  </div>
                )}
              </section>
            </div>
                )
                }
            
            <hr className="h-2 bg-gray-100 border-none my-6" />
            
            {/* 매장 유의사항 섹션 */}
            <section>
              <div className="px-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">매장 유의사항</h3>
                </div>
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-base font-normal mb-4" style={{ wordBreak: 'break-all' }}>
                      <strong>[필수]</strong> 확인해주세요.
                    </h4>
                    <div>
                      <label className="flex items-center mb-3">
                        <input 
                          id="precaution_item_A_137380" 
                          type="checkbox" 
                          className="w-5 h-5 mr-2" 
                          name="precaution_item_137380" 
                          value="137380"
                          checked={checkboxes.precaution1}
                          onChange={handleCheckbox('precaution1')}
                        />
                        <span className="text-sm font-medium" style={{ wordBreak: 'break-all' }}>
                          <span className="font-bold"></span>
                          주문은 가게 운영 상황에 따라 거절될 수 있습니다.
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          id="precaution_item_A_138077" 
                          type="checkbox" 
                          className="w-5 h-5 mr-2" 
                          name="precaution_item_138077" 
                          value="138077"
                          checked={checkboxes.precaution2}
                          onChange={handleCheckbox('precaution2')}
                        />
                        <span className="text-sm font-medium" style={{ wordBreak: 'break-all' }}>
                          <span className="font-bold"></span>
                          주문 및 픽업 관련 알림은 알림톡으로 발송됩니다.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="h-40"></div>
          </main>
        {/* <form onSubmit={handleOrderClick} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] ${
                !isNameValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="이름을 입력해주세요"
            />
            {!isNameValid && (
              <p className="mt-1 text-sm text-red-500">이름을 입력해주세요</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호(알림톡 발송)
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              id="phone"
              value={phone}
              maxLength={11}
              minLength={11}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] ${
                !isPhoneValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="전화번호를 입력해주세요 (예: 01012345678)"
            />
            {!isPhoneValid && (
              <p className="mt-1 text-sm text-red-500">올바른 전화번호를 입력해주세요</p>
            )}
          </div>

          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              요청사항
            </label>
            <textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355]"
              placeholder="요청사항을 입력해주세요"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleSugarRequest('설탕 많이')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                설탕 많이
              </button>
              <button
                type="button"
                onClick={() => handleSugarRequest('설탕 X')}
                className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
              >
                설탕 X
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </form> */}
      </div>

      {/* 전화번호 확인 모달 */}
      {showPhoneConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center mb-4">전화번호 확인</h3>
              <p className="text-center mb-6">
                아래 전화번호로 알림톡이 발송됩니다.<br />
                전화번호가 정확한지 확인해주세요.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-center text-lg font-bold text-[#FF7355]">{formatPhoneNumber(phone)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPhoneConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  수정하기
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-[#FF7355] text-white font-medium rounded-lg hover:bg-[#FF6344]"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 하단 주문 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading || !user}
          className={`w-full py-3.5 bg-[#FF7355] text-white font-medium rounded-lg transition-colors duration-200 ${
            isLoading || !user
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#FF6344]'
          }`}
        >
          {isLoading ? '주문 처리 중...' : '주문 완료'}
        </button>
      </div>

       {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm mx-4 rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">로그인</h3>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* 이메일/비밀번호 로그인 폼 */}
                <div className="space-y-3">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="비밀번호"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    />
                  </div>
                  <button 
                    className="w-full bg-[#FF7355] text-white py-3 rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
                    disabled={!email || !loginPassword}
                    onClick={handleLogin}
                  >
                    로그인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 