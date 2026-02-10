import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, MessageSquare, Clock, Search, Users, Settings, Layers, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate('/');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold font-heading text-foreground">Uvix</span>
        </div>
        <Button
          onClick={() => navigate('/auth')}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          Sign in
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-5 text-foreground">
          A quiet assistant for your website
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Uvix helps your visitors find answers, ask questions, and get support — without
          waiting for someone on your team to respond.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-7"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-border text-muted-foreground hover:text-foreground px-7"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* What it does */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold font-heading mb-4 text-foreground">
          What it does
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Most websites leave visitors to figure things out on their own. Uvix sits on your
          site and helps people find what they need. It answers questions, points visitors in
          the right direction, and handles the kind of support that usually takes up your
          team's time.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          It works in the background. You set it up once, and it takes care of the rest.
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* How people use it */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold font-heading mb-10 text-foreground">
          How people use it
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: 'Finding information',
              desc: 'Visitors get answers to their questions without digging through pages or waiting for a reply.',
            },
            {
              icon: MessageSquare,
              title: 'Answering common questions',
              desc: 'The same questions come up again and again. Uvix handles them so your team does not have to.',
            },
            {
              icon: Clock,
              title: 'Supporting users anytime',
              desc: 'People visit your site outside business hours. Uvix is there when your team is not.',
            },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium font-heading text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* Why it's useful */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold font-heading mb-10 text-foreground">
          Why it is useful
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Saves time for your team',
              desc: 'Less time spent answering the same questions. More time for the work that matters.',
            },
            {
              icon: Layers,
              title: 'Reduces repeated work',
              desc: 'Common requests are handled automatically. Your team focuses on what needs a human touch.',
            },
            {
              icon: Settings,
              title: 'Makes your site easier to use',
              desc: 'Visitors find what they need faster. A better experience without a redesign.',
            },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium font-heading text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold font-heading mb-10 text-foreground">
          How it works
        </h2>
        <div className="space-y-8">
          {[
            { step: '1', title: 'Set up Uvix for your site', desc: 'Connect it to your website in a few minutes. No technical background needed.' },
            { step: '2', title: 'Choose what it should help with', desc: 'Tell it what topics to cover, what questions to expect, and how to respond.' },
            { step: '3', title: 'Let it run quietly', desc: 'Uvix works in the background. It helps your visitors while you focus on everything else.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">{item.step}</span>
              </div>
              <div>
                <h3 className="font-medium font-heading text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold font-heading mb-4 text-foreground">
          Try it for yourself
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Set up takes a few minutes. No commitment, no credit card.
        </p>
        <Button
          onClick={() => navigate('/auth')}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
        >
          Start Using Uvix
          <Play className="w-4 h-4 ml-1.5" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Uvix. Built to be useful.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
