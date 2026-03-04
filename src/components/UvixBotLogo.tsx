interface UvixBotLogoProps {
  size?: number;
  className?: string;
}

const UvixBotLogo = ({ size = 28, className = '' }: UvixBotLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Antenna */}
    <line x1="50" y1="8" x2="50" y2="20" stroke="#a855f7" strokeWidth="2" />
    <circle cx="50" cy="6" r="4" fill="#c084fc" />

    {/* Side ears */}
    <rect x="8" y="42" width="6" height="16" rx="2" fill="#7c3aed" />
    <rect x="86" y="42" width="6" height="16" rx="2" fill="#7c3aed" />

    {/* Outer hexagon */}
    <polygon
      points="50,18 82,34 82,66 50,82 18,66 18,34"
      fill="#1a0a2e"
      stroke="#a855f7"
      strokeWidth="2.5"
    />

    {/* Inner hex ring */}
    <polygon
      points="50,26 74,38 74,62 50,74 26,62 26,38"
      fill="none"
      stroke="#7c3aed"
      strokeWidth="1.5"
      opacity="0.5"
    />

    {/* Eyes */}
    <rect x="34" y="40" width="10" height="8" rx="2" fill="#a855f7" />
    <rect x="56" y="40" width="10" height="8" rx="2" fill="#a855f7" />

    {/* Eye glow dots */}
    <circle cx="39" cy="43" r="1.5" fill="#e0aaff" />
    <circle cx="61" cy="43" r="1.5" fill="#e0aaff" />

    {/* Mouth */}
    <path
      d="M 40 58 Q 50 64 60 58"
      stroke="#a855f7"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default UvixBotLogo;
