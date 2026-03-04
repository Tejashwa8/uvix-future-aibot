import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24" style={{ background: '#121212' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="relative rounded-[18px] p-16 text-center border overflow-hidden"
          style={{ background: '#161616', borderColor: '#222' }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.08), transparent 70%)' }} />

          <motion.p variants={fadeUp} className="text-[11px] font-bold tracking-[4px] mb-3 relative z-10"
            style={{ color: '#a855f7', fontFamily: "'Orbitron', sans-serif" }}>
            GET STARTED
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-4 relative z-10"
            style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
            Ready to experience{' '}
            <span className="gradient-text">UVIX AI</span>?
          </motion.h2>

          <motion.p variants={fadeUp} className="text-sm mb-8 relative z-10" style={{ color: '#888' }}>
            Join thousands of developers and researchers already building with UVIX.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 relative z-10">
            <Button onClick={() => navigate('/auth')} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
              Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/auth')} className="border-border text-muted-foreground hover:text-foreground">
              Login
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs mt-6 relative z-10" style={{ color: '#555' }}>
            No credit card required · Free tier available
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
