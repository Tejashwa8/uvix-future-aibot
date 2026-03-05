import UvixBotLogo from '@/components/UvixBotLogo';

const LinkItem = ({ children }: { children: string }) => (
  <li>
    <a href="#" className="text-[13px] transition-colors duration-200"
      style={{ color: '#2e2e2e', fontFamily: "'Space Grotesk', sans-serif" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#2e2e2e'; }}>
      {children}
    </a>
  </li>
);

const Footer = () => (
  <footer style={{ background: '#0a0a0a', borderTop: '1px solid #181818', padding: '56px 6% 28px' }}>
    <div style={{ maxWidth: 1060, margin: '0 auto' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div style={{ maxWidth: 200 }}>
          <div className="flex items-center gap-2 mb-3">
            <UvixBotLogo size={26} showEars={false} />
            <span className="font-black text-[13px] tracking-[4px]" style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
              UVIX AI
            </span>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: '#2e2e2e', fontFamily: "'Space Grotesk', sans-serif" }}>
            Next-generation AI platform for developers and teams.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-bold tracking-[2px] mb-3" style={{ fontSize: 12, color: '#555', fontFamily: "'Orbitron', sans-serif" }}>PRODUCT</h4>
          <ul className="space-y-2">
            <LinkItem>Features</LinkItem>
            <LinkItem>API</LinkItem>
            <LinkItem>Changelog</LinkItem>
          </ul>
        </div>

        {/* Docs */}
        <div>
          <h4 className="font-bold tracking-[2px] mb-3" style={{ fontSize: 12, color: '#555', fontFamily: "'Orbitron', sans-serif" }}>DOCS</h4>
          <ul className="space-y-2">
            <LinkItem>Getting Started</LinkItem>
            <LinkItem>API Reference</LinkItem>
            <LinkItem>SDKs</LinkItem>
            <LinkItem>Examples</LinkItem>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#181818' }}>
        <p className="text-[12px]" style={{ color: '#222' }}>© 2026 UVIX AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {['Privacy', 'Terms', 'Security'].map((t) => (
            <a key={t} href="#" className="text-[12px] transition-colors duration-200"
              style={{ color: '#222' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#a855f7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#222'; }}>
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
