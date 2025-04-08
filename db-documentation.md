# 푸드 주문 서비스 데이터베이스 구조 가이드

이 문서는 푸드 주문 서비스의 데이터베이스 구조를 기획자가 이해하기 쉽게 설명합니다. 화면 설계 및 기능 기획 시 참고하시기 바랍니다.

## 목차
1. [사용자 관리](#1-사용자-관리)
2. [상점 관리](#2-상점-관리)
3. [메뉴 관리](#3-메뉴-관리)
4. [주문 관리](#4-주문-관리)
5. [데이터 관계도](#5-데이터-관계도)

---

## 1. 사용자 관리

### 1.1. 사용자 정보 (users)
모든 사용자의 기본 정보를 저장합니다. 고객과 사장님 모두 이 테이블에 등록됩니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 사용자 고유 식별자 | 자동 증가 |
| email | 이메일 주소 | 로그인 ID로 사용 |
| password | 암호화된 비밀번호 | bcrypt 해시 사용 |
| phone | 전화번호 | |
| is_active | 계정 활성화 상태 | 기본값: true |
| last_login_at | 마지막 로그인 시간 | |
| created_at | 생성 시간 | |
| updated_at | 수정 시간 | |
| deleted_at | 삭제 시간 | 소프트 삭제 사용 |

### 1.2. 고객 프로필 (customer_profiles)
고객 역할을 가진 사용자의 추가 정보를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 프로필 고유 식별자 | 자동 증가 |
| user_id | 사용자 ID | users 테이블 참조 |
| first_name | 이름 | |
| last_name | 성 | |
| profile_image | 프로필 이미지 URL | |

### 1.3. 사장님 프로필 (owner_profiles)
상점 사장님 역할을 가진 사용자의 추가 정보를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 프로필 고유 식별자 | 자동 증가 |
| user_id | 사용자 ID | users 테이블 참조 |
| first_name | 이름 | |
| last_name | 성 | |
| profile_image | 프로필 이미지 URL | |

### 1.4. 세션 관리 (user_sessions)
사용자 로그인 세션을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 세션 고유 식별자 | 자동 증가 |
| user_id | 사용자 ID | users 테이블 참조 |
| session_token | 세션 토큰 | JWT 토큰 |
| refresh_token | 리프레시 토큰 | |
| device_info | 디바이스 정보 | JSON 형식 |
| ip_address | IP 주소 | |
| expires_at | 만료 시간 | |
| is_valid | 유효 여부 | |

---

## 2. 상점 관리

### 2.1. 상점 카테고리 (store_categories)
상점의 업종 분류를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 카테고리 고유 식별자 | 자동 증가 |
| name | 카테고리 이름 | 예: 한식, 중식, 카페 등 |

### 2.2. 상점 정보 (stores)
상점의 기본 정보를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 상점 고유 식별자 | 자동 증가 |
| owner_id | 사장님 프로필 ID | owner_profiles 테이블 참조 |
| name | 상점 이름 | |
| english_name | 영문 이름 | |
| business_registration_number | 사업자 등록번호 | |
| business_registration_file | 사업자 등록증 파일 URL | |
| category_id | 상점 카테고리 ID | store_categories 테이블 참조 |
| address | 주소 | |
| address_detail | 상세 주소 | |
| phone | 전화번호 | |
| business_hours | 영업시간 | |
| description | 상점 설명 | |
| logo_image | 로고 이미지 URL | |
| banner_image | 배너 이미지 URL | |
| is_verified | 인증 여부 | |
| is_active | 활성화 상태 | |

### 2.3. 영업시간 (store_operating_hours)
상점의 요일별 영업시간을 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| day_of_week | 요일 | 'monday', 'tuesday', ... |
| opening_time | 오픈 시간 | |
| closing_time | 마감 시간 | |
| break_start_time | 브레이크 타임 시작 | |
| break_end_time | 브레이크 타임 종료 | |
| is_day_off | 휴무일 여부 | |

### 2.4. 특별 영업일 (store_special_days)
정기 휴무일이나 특별 영업일을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| date | 날짜 | |
| is_closed | 휴무 여부 | |
| opening_time | 오픈 시간 | 특별 영업시간 |
| closing_time | 마감 시간 | 특별 영업시간 |
| reason | 사유 | |

### 2.5. 부가서비스 (amenities)
상점에서 제공하는 부가서비스 목록을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| name | 서비스 이름 | 예: 주차 가능, 와이파이 등 |
| icon | 아이콘 이미지 URL | |

### 2.6. 상점-부가서비스 연결 (store_amenities)
상점과 부가서비스 간의 다대다 관계를 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| store_id | 상점 ID | stores 테이블 참조 |
| amenity_id | 부가서비스 ID | amenities 테이블 참조 |

### 2.7. 상점 운영 상태 (store_operation_status)
상점의 주문 수신 가능 상태를 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| is_accepting_orders | 주문 수신 여부 | |
| pause_until | 일시 중지 종료 시간 | |
| pause_reason | 일시 중지 사유 | |
| pause_type | 일시 중지 유형 | 'temporary', 'today', 'indefinite' |

### 2.8. 상점 혜택 (store_benefits)
상점에서 제공하는 혜택 정보를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| title | 혜택 제목 | |
| description | 혜택 설명 | |
| condition_description | 적용 조건 설명 | |
| is_active | 활성화 상태 | |
| start_date | 시작일 | |
| end_date | 종료일 | |
| display_order | 표시 순서 | |

---

## 3. 메뉴 관리

### 3.1. 메뉴 카테고리 (menu_categories)
상점 내 메뉴 카테고리를 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| name | 카테고리 이름 | 예: 커피, 디저트, 식사 등 |
| description | 카테고리 설명 | |
| display_order | 표시 순서 | |
| is_active | 활성화 상태 | |

### 3.2. 메뉴 아이템 (menu_items)
개별 메뉴 아이템을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| category_id | 메뉴 카테고리 ID | menu_categories 테이블 참조 |
| name | 메뉴 이름 | |
| description | 메뉴 설명 | |
| price | 가격 | |
| discounted_price | 할인 가격 | |
| image_url | 이미지 URL | |
| preparation_time | 준비 시간 (분) | |
| is_available | 판매 가능 여부 | |
| is_popular | 인기 메뉴 여부 | |
| is_new | 신메뉴 여부 | |
| is_recommended | 추천 메뉴 여부 | |
| stock_quantity | 재고 수량 | |
| display_order | 표시 순서 | |

### 3.3. 옵션 그룹 (option_groups)
메뉴에 적용 가능한 옵션 그룹을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| store_id | 상점 ID | stores 테이블 참조 |
| name | 그룹 이름 | 예: 사이즈, 토핑, 온도 등 |
| description | 그룹 설명 | |
| is_required | 필수 선택 여부 | |
| min_selections | 최소 선택 개수 | |
| max_selections | 최대 선택 개수 | |
| display_order | 표시 순서 | |

### 3.4. 옵션 아이템 (option_items)
옵션 그룹에 속한 개별 옵션 항목을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| group_id | 옵션 그룹 ID | option_groups 테이블 참조 |
| name | 옵션 이름 | 예: 대, 중, 소 또는 샷 추가 등 |
| price | 추가 가격 | |
| is_available | 판매 가능 여부 | |
| display_order | 표시 순서 | |

### 3.5. 메뉴-옵션 그룹 연결 (menu_option_groups)
메뉴와 옵션 그룹 간의 연결을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| menu_id | 메뉴 ID | menu_items 테이블 참조 |
| option_group_id | 옵션 그룹 ID | option_groups 테이블 참조 |
| display_order | 표시 순서 | |

### 3.6. 메뉴 가용성 (menu_availability)
메뉴의 판매 가능 시간을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| menu_id | 메뉴 ID | menu_items 테이블 참조 |
| day_of_week | 요일 | |
| start_time | 판매 시작 시간 | |
| end_time | 판매 종료 시간 | |
| is_available | 판매 가능 여부 | |

---

## 4. 주문 관리

### 4.1. 주문 정보 (orders)
고객의 주문 정보를 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_number | 주문 번호 | 고객에게 표시되는 번호 |
| customer_id | 고객 ID | customer_profiles 테이블 참조 |
| store_id | 상점 ID | stores 테이블 참조 |
| status | 주문 상태 | 'pending', 'accepted', 'rejected', 'preparing', 'ready', 'completed', 'canceled' |
| total_amount | 총 주문 금액 | |
| discount_amount | 할인 금액 | |
| final_amount | 최종 결제 금액 | |
| payment_status | 결제 상태 | 'pending', 'completed', 'failed', 'refunded', 'partially_refunded' |
| payment_method | 결제 방법 | 'credit_card', 'bank_transfer', 'mobile_payment', 'point', 'cash', 'other' |
| pickup_time | 예약된 픽업 시간 | |
| actual_pickup_time | 실제 픽업 시간 | |
| customer_note | 고객 요청사항 | |
| rejection_reason | 주문 거부 이유 | |

### 4.2. 주문 항목 (order_items)
주문에 포함된 메뉴 항목을 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_id | 주문 ID | orders 테이블 참조 |
| menu_item_id | 메뉴 ID | menu_items 테이블 참조 |
| quantity | 수량 | |
| unit_price | 개당 가격 | 주문 시점 가격 |
| total_price | 항목 총 가격 | 수량 * 개당 가격 |
| special_instructions | 특별 요청사항 | 예: 소스 적게 등 |

### 4.3. 주문 항목 옵션 (order_item_options)
주문된 메뉴 항목에 적용된 옵션을 저장합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_item_id | 주문 항목 ID | order_items 테이블 참조 |
| option_item_id | 옵션 항목 ID | option_items 테이블 참조 |
| quantity | 수량 | |
| price | 옵션 가격 | 주문 시점 가격 |

### 4.4. 주문 상태 이력 (order_status_history)
주문 상태 변경 이력을 추적합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_id | 주문 ID | orders 테이블 참조 |
| previous_status | 이전 상태 | |
| new_status | 새 상태 | |
| changed_by | 변경한 사용자 ID | |
| changed_at | 변경 시간 | |
| reason | 변경 이유 | |

### 4.5. 주문 알림 (order_notifications)
주문 관련 알림을 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_id | 주문 ID | orders 테이블 참조 |
| recipient_id | 수신자 ID | |
| recipient_type | 수신자 유형 | 'customer' 또는 'owner' |
| type | 알림 유형 | 예: 'order_accepted', 'pickup_ready' 등 |
| title | 알림 제목 | |
| message | 알림 내용 | |
| is_read | 읽음 여부 | |
| sent_at | 발송 시간 | |
| read_at | 읽은 시간 | |

### 4.6. 주문 결제 정보 (order_payments)
주문 결제 상세 정보를 관리합니다.

| 필드명 | 설명 | 비고 |
|-------|------|------|
| id | 고유 식별자 | 자동 증가 |
| order_id | 주문 ID | orders 테이블 참조 |
| amount | 결제 금액 | |
| payment_method | 결제 방법 | |
| payment_status | 결제 상태 | |
| transaction_id | 거래 ID | 외부 결제 시스템 ID |
| payment_details | 결제 상세 정보 | JSON 형식 |
| paid_at | 결제 완료 시간 | |
| refunded_at | 환불 처리 시간 | |

---

## 5. 데이터 관계도

### 5.1. 사용자 관리
```
users
  ↓
  ├──> customer_profiles
  └──> owner_profiles
        ↓
        └──> stores
```

### 5.2. 상점 관리
```
stores
  ↓
  ├──> store_categories
  ├──> store_operating_hours
  ├──> store_special_days
  ├──> store_operation_status
  ├──> store_benefits
  └──> amenities (via store_amenities)
```

### 5.3. 메뉴 관리
```
stores
  ↓
  ├──> menu_categories
  └──> menu_items
        ↓
        ├──> menu_availability
        └──> option_groups (via menu_option_groups)
              ↓
              └──> option_items
```

### 5.4. 주문 관리
```
orders
  ↓
  ├──> customer_profiles
  ├──> stores
  ├──> order_items
  │     ↓
  │     ├──> menu_items
  │     └──> order_item_options
  │           ↓
  │           └──> option_items
  ├──> order_status_history
  ├──> order_notifications
  └──> order_payments
```

---

## 6. 주요 비즈니스 프로세스

### 6.1. 회원가입 및 로그인
1. 사용자 가입 (users 테이블에 저장)
2. 고객 또는 사장님 프로필 생성 (customer_profiles 또는 owner_profiles)
3. 로그인 시 세션 생성 (user_sessions)

### 6.2. 상점 등록 및 관리
1. 사장님이 상점 정보 등록 (stores)
2. 영업시간 설정 (store_operating_hours)
3. 특별 영업일/휴무일 관리 (store_special_days)
4. 제공 서비스 설정 (store_amenities)
5. 메뉴 카테고리 및 메뉴 아이템 등록 (menu_categories, menu_items)
6. 옵션 그룹 및 아이템 설정 (option_groups, option_items)

### 6.3. 주문 프로세스
1. 고객이 메뉴 선택 및 주문 (orders, order_items, order_item_options)
2. 결제 처리 (order_payments)
3. 사장님 주문 확인 및 상태 변경 (orders.status 업데이트)
4. 주문 상태 변경에 따른 알림 발송 (order_notifications)
5. 고객 픽업 및 주문 완료 처리

---

## 7. 화면 설계 관련 테이블 연계 정보

### 7.1. 고객용 앱/웹 화면
- **메인 화면**: stores, store_categories, store_operation_status
- **상점 상세**: stores, store_operating_hours, store_special_days, amenities, store_benefits
- **메뉴 목록**: menu_categories, menu_items
- **메뉴 상세**: menu_items, option_groups, option_items
- **장바구니**: (임시 데이터, DB 저장하지 않음)
- **주문 화면**: orders, order_items, order_item_options
- **주문 내역**: orders, order_items, order_status_history
- **주문 상세**: orders, order_items, order_item_options, order_status_history

### 7.2. 사장님용 앱/웹 화면
- **대시보드**: orders (통계), store_operation_status
- **상점 관리**: stores, store_operating_hours, store_special_days, amenities
- **메뉴 관리**: menu_categories, menu_items, option_groups, option_items
- **주문 접수**: orders, order_items, order_item_options
- **주문 내역**: orders, order_status_history
- **영업 관리**: store_operation_status, store_pause_history
