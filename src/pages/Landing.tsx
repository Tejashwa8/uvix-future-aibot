import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CapabilitiesSection from '@/components/landing/CapabilitiesSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate('/');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen" style={{ background: '#121212' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CapabilitiesSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
