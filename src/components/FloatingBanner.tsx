import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';

export const FloatingBanner = () => {
  const { data } = useSite();
  const banner = data.floatingBanner || {
    line1: "모델하우스 방문예약 접수중",
    line2: "입주시까지 0원 파격조건",
    phone: "1588-0000",
    show: true
  };

  if (!banner.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] hidden lg:flex"
    >
      <a
        href={`tel:${banner.phone}`}
        className="quick-admin-banner flex items-stretch bg-[#4B0082] border-[4px] border-[#FFD700] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
      >
        {/* Line 1: White Vertical Text */}
        <div className="px-3 py-6 flex items-center justify-center border-r border-white/20">
          <span className="text-white font-bold text-lg [writing-mode:vertical-rl] tracking-widest">
            {banner.line1}
          </span>
        </div>

        {/* Line 2: Yellow Vertical Text */}
        <div className="px-3 py-6 flex items-center justify-center border-r border-white/20">
          <span className="text-[#FFD700] font-bold text-lg [writing-mode:vertical-rl] tracking-widest">
            {banner.line2}
          </span>
        </div>

        {/* Line 3: Yellow Box with Purple Vertical Text */}
        <div className="px-4 py-6 bg-[#FFD700] flex flex-col items-center justify-center gap-2">
          <span className="text-[#4B0082] font-black text-xl [writing-mode:vertical-rl] tracking-widest">
            {banner.phone}
          </span>
        </div>
      </a>
    </motion.div>
  );
};
