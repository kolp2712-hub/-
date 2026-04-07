import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Highlights } from '../components/Highlights';
import { Gallery } from '../components/Gallery';
import { LocationMap } from '../components/LocationMap';
import { FloorPlans } from '../components/FloorPlans';
import { Notices } from '../components/Notices';
import { InquiryForm } from '../components/InquiryForm';
import { Footer } from '../components/Footer';
import { QuickMenu } from '../components/QuickMenu';
import { FloatingBanner } from '../components/FloatingBanner';
import { MobileStickyFooter } from '../components/MobileStickyFooter';
import { useSite } from '../context/SiteContext';

const Home = () => {
  const { data } = useSite();

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0" style={{ fontFamily: data.fontFamily }}>
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Gallery />
        <LocationMap />
        <FloorPlans />
        <Notices />
        <InquiryForm />
      </main>
      <Footer />
      <QuickMenu />
      <FloatingBanner />
      <MobileStickyFooter />
    </div>
  );
};

export default Home;
