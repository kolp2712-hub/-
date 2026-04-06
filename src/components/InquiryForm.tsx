import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Send, CheckCircle2 } from 'lucide-react';

export const InquiryForm = () => {
  const { data } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/xbdpqnzl', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          setError(data.errors.map((error: any) => error.message).join(', '));
        } else {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
                {data.inquiryTitle}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{data.inquirySubtitle}</h3>
              <p className="text-gray-400">
                {data.inquiryDescription}
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-400" />
                <h4 className="text-2xl font-bold">상담 예약이 완료되었습니다!</h4>
                <p className="text-gray-400 text-center">
                  담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">성함</label>
                    <input
                      required
                      name="name"
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all"
                      placeholder="홍길동"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">연락처</label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all"
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">관심 타입</label>
                  <select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all appearance-none">
                    {(data.floorPlans || []).map((plan) => (
                      <option key={plan.id} value={plan.type} className="bg-gray-900">{plan.type}</option>
                    ))}
                    <option value="기타 문의" className="bg-gray-900">기타 문의</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">문의내용 (선택)</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all"
                    placeholder="궁금하신 내용을 입력해주세요."
                  />
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input required name="privacy_consent" type="checkbox" id="privacy" className="mt-1" />
                  <label htmlFor="privacy" className="text-xs text-gray-400 leading-relaxed">
                    개인정보 수집 및 이용에 동의합니다. (분양 상담 및 정보 제공 목적)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: data.themeColor }}
                >
                  {isSubmitting ? '전송 중...' : data.inquiryButtonText}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
