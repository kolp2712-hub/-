import { SiteData } from './types';

export const INITIAL_SITE_DATA: SiteData = {
  // SEO & Meta
  seoTitle: "평택 브레인시티 비스타동원 - 공식 홍보 사이트",
  seoDescription: "평택 브레인시티의 미래가치, 비스타동원에서 시작됩니다. 카이스트 평택캠퍼스, 아주대 병원 인접 프리미엄 주거 단지.",
  
  // Header
  title: "평택 브레인시티 비스타동원",
  logoIcon: "building-2",
  representativePhone: "1588-0000",
  
  // Hero Section
  heroSlogan: "평택의 미래를 여는 프리미엄 주거의 완성",
  heroDescription: "카이스트 평택캠퍼스, 아주대 병원, 삼성전자가 인접한 최상의 입지",
  heroButtonText: "상담 예약하기",
  heroImages: ["https://picsum.photos/seed/vista-hero/1920/1080"],
  
  // Highlights Section
  highlightsTitle: "Key Highlights",
  highlightsSubtitle: "비스타동원이 제안하는 압도적 가치",
  highlights: [
    {
      id: "h1",
      title: "카이스트 평택캠퍼스",
      description: "글로벌 인재 양성의 중심, 카이스트 인접 프리미엄",
      icon: "graduation-cap"
    },
    {
      id: "h2",
      title: "아주대 병원",
      description: "최첨단 의료 인프라를 누리는 안심 생활권",
      icon: "hospital"
    },
    {
      id: "h3",
      title: "삼성전자 평택캠퍼스",
      description: "세계 최대 규모 반도체 생산 라인의 배후 주거지",
      icon: "cpu"
    }
  ],
  
  // Gallery Section
  galleryTitle: "Architecture",
  gallerySubtitle: "도시의 스카이라인을 바꾸는 감각적인 단지 설계",
  galleryDescription: "자연과 조화를 이루는 조경 설계와 모던한 건축미가 어우러진 비스타동원만의 프리미엄 단지를 경험하세요.",
  galleryImages: [
    "https://picsum.photos/seed/vista-ext-1/800/450",
    "https://picsum.photos/seed/vista-ext-2/800/450"
  ],
  
  // Location Section
  locationTitle: "Location",
  locationSubtitle: "평택의 중심, 브레인시티의 미래가치",
  locationMaps: ["https://picsum.photos/seed/vista-map/1200/800"],
  locationMapUrl: "https://map.kakao.com/",
  locationButtonText: "카카오맵으로 보기",
  locationFeatures: [
    { id: "lf1", title: "광역 교통망", description: "SRT 평택지제역, 1호선 평택역 등 쾌속 교통망으로 서울 및 수도권 접근성이 뛰어납니다.", icon: "train" },
    { id: "lf2", title: "생활 인프라", description: "단지 인근 중심상업지구, 대형 마트, 아주대 병원(예정) 등 완벽한 생활 편의시설을 갖추고 있습니다.", icon: "shopping-bag" },
    { id: "lf3", title: "교육 환경", description: "카이스트 평택캠퍼스(예정)와 초·중·고교 부지가 인접하여 우수한 교육 여건을 자랑합니다.", icon: "graduation-cap" }
  ],
  
  // Floor Plans Section
  floorPlansTitle: "Floor Plans",
  floorPlansSubtitle: "공간의 가치를 높이는 혁신 평면",
  floorPlans: [
    {
      id: "type-a",
      type: "84㎡ A타입",
      images: ["https://picsum.photos/seed/vista-floor-a/800/600"],
      description: "채광과 통풍이 우수한 4Bay 판상형 구조",
      details: [
        { label: "전용면적", value: "84.98㎡" },
        { label: "공급면적", value: "112.45㎡" },
        { label: "계약면적", value: "165.78㎡" },
        { label: "세대수", value: "245세대" }
      ]
    },
    {
      id: "type-b",
      type: "84㎡ B타입",
      images: ["https://picsum.photos/seed/vista-floor-b/800/600"],
      description: "공간 활용도를 극대화한 타워형 구조",
      details: [
        { label: "전용면적", value: "84.95㎡" },
        { label: "공급면적", value: "112.40㎡" },
        { label: "계약면적", value: "165.70㎡" },
        { label: "세대수", value: "120세대" }
      ]
    }
  ],
  
  // Notices Section
  noticesTitle: "News & Notices",
  noticesSubtitle: "분양 소식 및 공지사항",
  notices: [
    {
      id: "n1",
      title: "평택 브레인시티 비스타동원 분양 공고",
      content: "2026년 상반기 분양 예정입니다. 많은 관심 부탁드립니다.",
      date: "2026-04-01"
    }
  ],
  
  // Inquiry Section
  inquiryTitle: "Consultation",
  inquirySubtitle: "분양 상담 예약",
  inquiryDescription: "전문 상담사가 친절하게 안내해 드립니다. 연락처를 남겨주세요.",
  inquiryButtonText: "상담 예약 신청하기",
  
  // e-Model House
  eModelHouseUrl: "https://my.matterport.com/show/?m=...",
  
  // Footer Section
  footerCopyright: "© 2026 동원건설. All rights reserved.",
  footerInfo: {
    developer: "(주)비스타개발",
    constructor: "동원건설",
    address: "경기도 평택시 브레인시티 일원",
    phone: "1588-0000"
  },

  // Quick Menu
  quickMenu: {
    kakaoUrl: "https://pf.kakao.com/",
    phone: "1588-0000",
    facebookUrl: "https://www.facebook.com/"
  },

  // Floating Banner
  floatingBanner: {
    line1: "모델하우스 방문예약 접수중",
    line2: "입주시까지 0원 파격조건",
    phone: "1588-0000",
    show: true
  },
  
  // Theme
  themeColor: "#B6916B",
  fontFamily: "Pretendard, 'Noto Sans KR', sans-serif"
};
