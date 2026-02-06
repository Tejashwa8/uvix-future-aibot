import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VivixChat from '@/components/VivixChat';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
        <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[120px]" />
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[120px]" />
      
      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        <VivixChat />
      </div>
    </div>
  );
};

export default Index;
