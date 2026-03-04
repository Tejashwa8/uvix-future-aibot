import UvixBotLogo from '@/components/UvixBotLogo';

const linkStyle = { color: '#2e2e2e' };
const hoverColor = '#a855f7';

const LinkItem = ({ children }: { children: string }) => (
  <li>
    <a
      href="#"
      className="text-sm transition-colors duration-200"
      style={linkStyle}
      onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#2e2e2e'; }}
    >
      {children}
    </a>
  </li>
);

const Footer = () => (
  <footer style={{ background: '#0a0a0a', borderTop: '1px solid #181818' }} className="py-12">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UvixBotLogo size={26} />
            <span className="font-bold text-sm tracking-[3px]" style={{ fontFamily: "'Orbitron', sans-serif", color: '#f0f0f0' }}>
              UVIX AI
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#2e2e2e' }}>
            Next-generation AI platform for developers and teams.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-bold tracking-[2px] mb-3" style={{ color: '#555', fontFamily: "'Orbitron', sans-serif" }}>PRODUCT</h4>
          <ul className="space-y-2">
            <LinkItem>Features</LinkItem>
            <LinkItem>API</LinkItem>
            <LinkItem>Pricing</LinkItem>
            <LinkItem>Changelog</LinkItem>
          </ul>
        </div>

        {/* Docs */}
        <div>
          <h4 className="text-xs font-bold tracking-[2px] mb-3" style={{ color: '#555', fontFamily: "'Orbitron', sans-serif" }}>DOCS</h4>
          <ul className="space-y-2">
            <LinkItem>Getting Started</LinkItem>
            <LinkItem>API Reference</LinkItem>
            <LinkItem>SDKs</LinkItem>
            <LinkItem>Examples</LinkItem>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-bold tracking-[2px] mb-3" style={{ color: '#555', fontFamily: "'Orbitron', sans-serif" }}>COMPANY</h4>
          <ul className="space-y-2">
            <LinkItem>About</LinkItem>
            <LinkItem>Careers</LinkItem>
            <LinkItem>Blog</LinkItem>
            <LinkItem>Contact</LinkItem>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: '#181818' }}>
        <p className="text-xs" style={{ color: '#2e2e2e' }}>© 2026 UVIX AI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          {['Privacy', 'Terms', 'Security'].map((t) => (
            <a
              key={t}
              href="#"
              className="text-xs transition-colors duration-200"
              style={{ color: '#2e2e2e' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#2e2e2e'; }}
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
