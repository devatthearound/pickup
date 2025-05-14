'use client';
import { useUser } from '@/contexts/UserContext';
import { useAxios } from '@/hooks/useAxios';
import { setCookie } from '@/lib/useCookie';
import React, { useCallback, useState } from 'react';

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

const ReservationPage = () => {
    const { user } = useUser();
    const axios = useAxios();
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
    const res = await axios.post(`/auth/login2`, {
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
      return true;
    }
    return false;
  }


  const handleSignup = useCallback(async () => {
    const res = await axios.post(`/auth/register2`, {
        user_name : username,
        identifierType : 'phone',
        identifier : phone,
        password,
        role : 'customer'
      });

      if(res.status === 201) {  
        setCookie('pu-atac', res.data.data.accessToken, {
          expires: new Date(new Date().setMinutes(new Date().getMinutes() + 15)),
        });
        setCookie('pu-atrf', res.data.data.refreshToken, {
          expires: new Date(new Date().setDate(new Date().getDate() + 14)),
        });
        return true;
      } else{
      console.log('회원가입 실패');
    }
  }, [username, phone, password]);

  const handleLogin = async () => {
    const res = await login(email, loginPassword);
    if(res) {
      console.log('로그인 성공');
    }else{
      console.log('로그인 실패');
    }
  }

  return (
    <div className="font-sans text-gray-800 leading-normal antialiased">
      <div>
        <div className="relative">
          {/* 헤더 */}
          <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
            <div className="px-4">
              <div className="flex items-center py-4">
                <button type="button" className="text-gray-700" aria-label="닫기">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                    <path d="M4 4L20 20" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                  </svg>
                </button>
                <h1 className="ml-2 text-lg font-bold">르브리에</h1>
              </div>
            </div>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="pt-16 pb-0">
            
            {/* 예약 정보 섹션 */}
            <section className="my-5">
              <div className="px-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">예약 정보</h3>
                  <div>
                    <a href="#" className="text-sm text-gray-600">더보기</a>
                  </div>
                </div>
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="mb-2">
                        <p className="text-base">내일 (수) · 오전 11시 · 2명 </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {
                !user && (
            
            <div>
              <hr className="h-2 bg-gray-100 border-none my-6" />
              
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
              
              <hr className="h-px bg-gray-200 border-none my-5" />
              
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
                                <a href="#" className="ml-2 text-gray-500">?</a>
                              </div>
                              <div>
                                <div className="mb-2">
                                  <div className="flex gap-2 mb-2">
                                    <input 
                                      type="tel" 
                                      inputMode="tel" 
                                      className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-base" 
                                      placeholder="숫자만 입력해 주세요." 
                                      autoComplete="nope" 
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)} 
                                    />
                                    <button 
                                      type="button" 
                                      className={`w-28 h-12 rounded-md text-white font-bold ${!phone ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-500'}`}
                                      disabled={!phone}
                                    >
                                      인증번호 요청
                                    </button>
                                  </div>
                                </div>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-base" 
                                    placeholder="비밀번호를 입력해 주세요." 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-autocomplete="list" 
                                  />
                                </div>
                                <div>
                                  <input 
                                    type="password" 
                                    name="userPassword2" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-base" 
                                    placeholder="비밀번호를 다시 한 번 입력해 주세요."
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                  />
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8-20자리로 설정해주세요.
                                </p>
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
                            className="w-full h-12 bg-red-500 text-white font-bold rounded-md mt-10">가입하기</button>
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
                          <span className="font-bold">[필수] &nbsp;</span>
                          못 오실 경우에는 꼭 예약취소 부탁드립니다.
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
                          <span className="font-bold">[필수] &nbsp;</span>
                          30분 단위는 예약하실 때 요청사항에 기재부탁드립니다.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="h-40"></div>
          </main>
        </div>
      </div>

      {/* 하단 고정 예약 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 p-4">
        <div>
          <div>
            <div className="flex justify-between items-center">
              <p>
                <span className="block text-sm text-gray-500">예약 정보</span>
                <span className="text-base font-bold">
                  <span className="inline">05월 14일(수) · 오전 11:00 · </span>
                  <span className="inline">2명</span>
                </span>
              </p>
              <div>
                <button type="button" className="px-6 py-3 bg-red-500 text-white font-bold rounded-md">
                  <span>예약하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 스낵바 및 오버레이 */}
      <div id="snackbar" className="hidden"><div></div></div>
      <div id="overlay" className="hidden"></div>

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
};

export default ReservationPage;