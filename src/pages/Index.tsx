import MatrixBackground from '@/components/MatrixBackground';
import VivaxChat from '@/components/VivaxChat';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixBackground />
      
      {/* Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
      
      {/* Main Content */}
      <div className="relative z-10 h-screen flex flex-col">
        <VivaxChat />
      </div>
    </div>
  );
};

export default Index;
