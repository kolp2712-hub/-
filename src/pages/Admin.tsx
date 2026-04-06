import React, { useState, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Palette,
  Type,
  Upload,
  Globe,
  PlusCircle,
  MessageSquare,
  PhoneCall,
  Share
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageManager } from '../components/admin/ImageManager';

const Admin = () => {
  const { data, updateData, addNotice, deleteNotice, updateNotice, compressAndSetImage } = useSite();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'notices' | 'seo' | 'quickmenu'>('content');
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      await compressAndSetImage(file, callback);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('모든 변경사항이 저장되었습니다.');
    }, 800);
  };

  const addFloorPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      type: "새로운 타입",
      images: ["https://picsum.photos/seed/new-plan/800/600"],
      description: "평면 설명을 입력하세요.",
      details: [
        { label: "전용면적", value: "00.00㎡" },
        { label: "공급면적", value: "00.00㎡" },
        { label: "계약면적", value: "00.00㎡" },
        { label: "세대수", value: "00세대" }
      ]
    };
    updateData({ floorPlans: [...data.floorPlans, newPlan] });
  };

  const removeFloorPlan = (id: string) => {
    updateData({ floorPlans: data.floorPlans.filter(p => p.id !== id) });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">비밀번호를 입력하여 관리자 모드에 접속하세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
              placeholder="비밀번호 (0000)"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
            >
              접속하기
            </button>
            <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600">
              메인 페이지로 돌아가기
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Settings className="w-6 h-6 text-gray-900" />
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'content' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            콘텐츠 관리
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'images' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            이미지 관리
          </button>
          <button
            onClick={() => setActiveTab('quickmenu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'quickmenu' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            퀵메뉴 설정
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'notices' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            게시글 관리
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'seo' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO 설정
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setIsAuthorized(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'content' && '콘텐츠 관리'}
              {activeTab === 'images' && '이미지 관리'}
              {activeTab === 'quickmenu' && '퀵메뉴 설정'}
              {activeTab === 'notices' && '게시글 관리'}
              {activeTab === 'seo' && 'SEO 설정'}
            </h2>
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1">
              사이트 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> 기본 텍스트 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">사이트 제목</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => updateData({ title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 슬로건</label>
                    <input
                      type="text"
                      value={data.heroSlogan}
                      onChange={(e) => updateData({ heroSlogan: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 설명</label>
                  <textarea
                    value={data.heroDescription}
                    onChange={(e) => updateData({ heroDescription: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">히어로 버튼 문구</label>
                    <input
                      type="text"
                      value={data.heroButtonText}
                      onChange={(e) => updateData({ heroButtonText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">입지 버튼 문구</label>
                    <input
                      type="text"
                      value={data.locationButtonText}
                      onChange={(e) => updateData({ locationButtonText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5" /> 테마 및 스타일
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">포인트 컬러</label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={data.themeColor}
                        onChange={(e) => updateData({ themeColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-none"
                      />
                      <input
                        type="text"
                        value={data.themeColor}
                        onChange={(e) => updateData({ themeColor: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">폰트 패밀리</label>
                    <select
                      value={data.fontFamily}
                      onChange={(e) => updateData({ fontFamily: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="Pretendard, 'Noto Sans KR', sans-serif">Pretendard (권장)</option>
                      <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
                      <option value="serif">Serif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold">푸터 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">시행사</label>
                    <input
                      type="text"
                      value={data.footerInfo.developer}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, developer: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">시공사</label>
                    <input
                      type="text"
                      value={data.footerInfo.constructor}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, constructor: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">현장 주소</label>
                    <input
                      type="text"
                      value={data.footerInfo.address}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, address: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">분양 문의 번호</label>
                    <input
                      type="text"
                      value={data.footerInfo.phone}
                      onChange={(e) => updateData({ footerInfo: { ...data.footerInfo, phone: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">카피라이트</label>
                  <input
                    type="text"
                    value={data.footerCopyright}
                    onChange={(e) => updateData({ footerCopyright: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-12">
                <h3 className="text-lg font-bold">섹션별 이미지 동적 관리</h3>
                
                <ImageManager 
                  label="메인 히어로 이미지 리스트" 
                  images={data.heroImages} 
                  onChange={(newImages) => updateData({ heroImages: newImages })} 
                />

                <ImageManager 
                  label="갤러리 이미지 리스트" 
                  images={data.galleryImages} 
                  onChange={(newImages) => updateData({ galleryImages: newImages })} 
                />

                <ImageManager 
                  label="입지 지도 이미지 리스트" 
                  images={data.locationMaps} 
                  onChange={(newImages) => updateData({ locationMaps: newImages })} 
                />
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">평면도 리스트 관리</h3>
                  <button 
                    onClick={addFloorPlan}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold"
                  >
                    <PlusCircle className="w-4 h-4" /> 타입 추가
                  </button>
                </div>
                
                <div className="space-y-8">
                  {data.floorPlans?.map((plan, index) => (
                    <div key={plan.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900">타입 #{index + 1}</h4>
                        <button 
                          onClick={() => removeFloorPlan(plan.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <ImageManager 
                          label={`${plan.type} 이미지 리스트`} 
                          images={plan.images} 
                          onChange={(newImages) => {
                            const newPlans = [...data.floorPlans];
                            newPlans[index].images = newImages;
                            updateData({ floorPlans: newPlans });
                          }} 
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">타입 이름</label>
                            <input
                              type="text"
                              value={plan.type}
                              onChange={(e) => {
                                const newPlans = [...data.floorPlans];
                                newPlans[index].type = e.target.value;
                                updateData({ floorPlans: newPlans });
                              }}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">특징 설명</label>
                            <textarea
                              value={plan.description}
                              onChange={(e) => {
                                const newPlans = [...data.floorPlans];
                                newPlans[index].description = e.target.value;
                                updateData({ floorPlans: newPlans });
                              }}
                              rows={2}
                              className="w-full px-4 py-2 rounded-lg border border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">상세 정보 (면적, 세대수 등)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {plan.details?.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={detail.label}
                                  onChange={(e) => {
                                    const newPlans = [...data.floorPlans];
                                    newPlans[index].details[detailIndex].label = e.target.value;
                                    updateData({ floorPlans: newPlans });
                                  }}
                                  className="flex-1 px-3 py-2 border rounded-lg text-xs"
                                  placeholder="항목"
                                />
                                <input
                                  type="text"
                                  value={detail.value}
                                  onChange={(e) => {
                                    const newPlans = [...data.floorPlans];
                                    newPlans[index].details[detailIndex].value = e.target.value;
                                    updateData({ floorPlans: newPlans });
                                  }}
                                  className="flex-1 px-3 py-2 border rounded-lg text-xs"
                                  placeholder="값"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quickmenu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> 퀵메뉴 (플로팅 버튼) 설정
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">카카오톡 상담 URL</label>
                    <input
                      type="text"
                      value={data.quickMenu.kakaoUrl}
                      onChange={(e) => updateData({ quickMenu: { ...data.quickMenu, kakaoUrl: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      placeholder="https://pf.kakao.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">상담 전화번호</label>
                    <input
                      type="text"
                      value={data.quickMenu.phone}
                      onChange={(e) => updateData({ quickMenu: { ...data.quickMenu, phone: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">페이스북 공유 URL</label>
                    <input
                      type="text"
                      value={data.quickMenu.facebookUrl}
                      onChange={(e) => updateData({ quickMenu: { ...data.quickMenu, facebookUrl: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      placeholder="https://www.facebook.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">공지사항 목록</h3>
                  <button 
                    onClick={() => addNotice({ title: '새 공지사항', content: '내용을 입력하세요.' })}
                    className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> 새 글 작성
                  </button>
                </div>

                <div className="space-y-4">
                  {data.notices?.map((notice) => (
                    <div key={notice.id} className="p-6 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={notice.title}
                            onChange={(e) => updateNotice(notice.id, { title: e.target.value, content: notice.content })}
                            className="w-full text-lg font-bold border-none focus:ring-0 p-0"
                          />
                          <textarea
                            value={notice.content}
                            onChange={(e) => updateNotice(notice.id, { title: notice.title, content: e.target.value })}
                            className="w-full text-gray-500 border-none focus:ring-0 p-0 text-sm"
                            rows={2}
                          />
                        </div>
                        <button 
                          onClick={() => deleteNotice(notice.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">{notice.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5" /> 검색 엔진 최적화 (SEO)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">브라우저 탭 제목 (Title Tag)</label>
                    <input
                      type="text"
                      value={data.seoTitle}
                      onChange={(e) => updateData({ seoTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">검색 결과 설명 (Meta Description)</label>
                    <textarea
                      value={data.seoDescription}
                      onChange={(e) => updateData({ seoDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> 
              {isSaving ? '저장 중...' : '변경사항 저장 완료'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
