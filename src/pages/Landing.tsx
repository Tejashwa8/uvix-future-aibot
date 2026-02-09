import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, MessageSquare, Image, FileText, Mic, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate('/');
  }, [user, loading, navigate]);

  const features = [
    { icon: MessageSquare, title: 'Smart Conversations', description: 'Engage in natural, context-aware dialogue powered by advanced AI.' },
    { icon: Image, title: 'Image Generation', description: 'Create stunning visuals from text descriptions in seconds.' },
    { icon: FileText, title: 'File Analysis', description: 'Upload documents and images for instant AI-powered analysis.' },
    { icon: Mic, title: 'Voice Input', description: 'Speak naturally and let Uvix transcribe and respond.' },
    { icon: Zap, title: 'Lightning Fast', description: 'Real-time streaming responses for instant feedback.' },
    { icon: Shield, title: 'Secure & Private', description: 'End-to-end encryption with authenticated sessions.' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient effects */}
      <div className="fixed top-[-200px] left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[200px]" />
      <div className="fixed bottom-[-200px] right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[180px]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[250px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center animate-glow-pulse" style={{ background: 'var(--gradient-neon)' }}>
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold font-heading gradient-text">Uvix</span>
        </div>
        <Button onClick={() => navigate('/auth')} variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent box-glow-sm">
          Get Started
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Premium AI Assistant
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6">
          <span className="text-foreground">Your Intelligent</span>
          <br />
          <span className="gradient-text">AI Companion</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience the next generation of AI assistance. Uvix combines advanced language understanding, 
          image generation, and file analysis in one premium interface.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="text-primary-foreground px-8 py-6 text-base font-medium box-glow hover:scale-105 transition-transform"
            style={{ background: 'var(--gradient-neon)' }}
          >
            Start for Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border text-muted-foreground hover:text-foreground px-8 py-6 text-base"
          >
            Learn More
          </Button>
        </div>

        {/* Chat preview mockup */}
        <div className="mt-16 max-w-2xl mx-auto glass-panel neon-border rounded-2xl p-6 text-left">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-neon)' }}>
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium font-heading gradient-text">Uvix</span>
            <span className="text-xs text-muted-foreground">Premium AI</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2.5">
                <p className="text-sm text-foreground">Can you help me draft a professional email?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg neon-border flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, hsl(263 70% 58% / 0.2), hsl(187 85% 53% / 0.2))' }}>
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="glass-panel neon-border rounded-2xl rounded-tl-sm px-4 py-2.5">
                <p className="text-sm text-foreground">Of course! I'd be happy to help. Could you tell me the <span className="text-accent font-medium">purpose</span> of the email and the <span className="text-accent font-medium">recipient</span>? I'll craft something professional and polished.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold font-heading text-center mb-4 gradient-text">
          Powerful Features
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Everything you need in an AI assistant, beautifully designed and incredibly capable.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 hover:neon-border transition-all duration-300 group hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:box-glow-sm transition-all" style={{ background: 'var(--gradient-neon)' }}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold font-heading mb-2 text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="glass-panel neon-border rounded-3xl p-12">
          <h2 className="text-3xl font-bold font-heading mb-4 gradient-text">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of users who are already experiencing the future of AI assistance.
          </p>
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="text-primary-foreground px-10 py-6 text-base font-medium box-glow hover:scale-105 transition-transform"
            style={{ background: 'var(--gradient-neon)' }}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Uvix. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
