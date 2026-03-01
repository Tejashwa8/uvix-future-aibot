import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight, MessageSquare, Clock, Search, Users, Settings, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingOrb from '@/components/FloatingOrb';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

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
      <motion.section
        className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-5 text-foreground"
        >
          A quiet assistant for your website
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Uvix helps your visitors find answers, ask questions, and get support — without
          waiting for someone on your team to respond.
        </motion.p>
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3">
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
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See How It Works
          </Button>
        </motion.div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* What it does */}
      <motion.section
        className="max-w-3xl mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold font-heading mb-4 text-foreground">
          What it does
        </motion.h2>
        <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-3">
          Most websites leave visitors to figure things out on their own. Uvix sits on your
          site and helps people find what they need. It answers questions, points visitors in
          the right direction, and handles the kind of support that usually takes up your
          team's time.
        </motion.p>
        <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
          It works in the background. You set it up once, and it takes care of the rest.
        </motion.p>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* How people use it */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold font-heading mb-10 text-foreground">
          How people use it
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: 'Finding information', desc: 'Visitors get answers to their questions without digging through pages or waiting for a reply.' },
            { icon: MessageSquare, title: 'Answering common questions', desc: 'The same questions come up again and again. Uvix handles them so your team does not have to.' },
            { icon: Clock, title: 'Supporting users anytime', desc: 'People visit your site outside business hours. Uvix is there when your team is not.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium font-heading text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* Why it's useful */}
      <motion.section
        className="max-w-5xl mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold font-heading mb-10 text-foreground">
          Why it is useful
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Saves time for your team', desc: 'Less time spent answering the same questions. More time for the work that matters.' },
            { icon: Layers, title: 'Reduces repeated work', desc: 'Common requests are handled automatically. Your team focuses on what needs a human touch.' },
            { icon: Settings, title: 'Makes your site easier to use', desc: 'Visitors find what they need faster. A better experience without a redesign.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium font-heading text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* How it works */}
      <motion.section
        id="how-it-works"
        className="max-w-3xl mx-auto px-6 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold font-heading mb-10 text-foreground">
          How it works
        </motion.h2>
        <div className="space-y-8">
          {[
            { step: '1', title: 'Set up Uvix for your site', desc: 'Connect it to your website in a few minutes. No technical background needed.' },
            { step: '2', title: 'Choose what it should help with', desc: 'Tell it what topics to cover, what questions to expect, and how to respond.' },
            { step: '3', title: 'Let it run quietly', desc: 'Uvix works in the background. It helps your visitors while you focus on everything else.' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="flex gap-5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary">{item.step}</span>
              </div>
              <div>
                <h3 className="font-medium font-heading text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* CTA */}
      <motion.section
        className="max-w-3xl mx-auto px-6 py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.h2 variants={fadeUp} className="text-2xl font-semibold font-heading mb-4 text-foreground">
          Try it for yourself
        </motion.h2>
        <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Set up takes a few minutes. No commitment, no credit card.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
          >
            Start Using Uvix
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">Uvix. Built to be useful.</p>
      </footer>

      {/* Floating Orb */}
      <FloatingOrb />
    </div>
  );
};

export default Landing;
