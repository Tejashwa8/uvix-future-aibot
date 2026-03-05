interface UvixBotLogoProps {
  size?: number;
  className?: string;
  showEars?: boolean;
}

const UvixBotLogo = ({ size = 28, className = '', showEars = true }: UvixBotLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Antenna */}
    <line x1="32" y1="4" x2="32" y2="11" stroke="#a855f7" strokeWidth="1.5" />
    <circle cx="32" cy="3" r="2" fill="#c084fc" />

    {/* Side ears */}
    {showEars && (
      <>
        <rect x="5" y="27" width="4" height="10" rx="2" fill="#7c3aed" />
        <rect x="55" y="27" width="4" height="10" rx="2" fill="#7c3aed" />
      </>
    )}

    {/* Outer hexagon */}
    <polygon
      points="32,4 56,18 56,46 32,60 8,46 8,18"
      fill="#1a0a2e"
      stroke="#a855f7"
      strokeWidth="2"
    />

    {/* Inner hex ring */}
    <polygon
      points="32,10 51,21 51,43 32,54 13,43 13,21"
      fill="none"
      stroke="#7c3aed"
      strokeWidth="0.6"
      opacity="0.5"
    />

    {/* Eyes */}
    <rect x="21" y="25" width="7" height="5" rx="2" fill="#a855f7" />
    <rect x="36" y="25" width="7" height="5" rx="2" fill="#a855f7" />

    {/* Eye glow dots */}
    <circle cx="24.5" cy="27.5" r="1.5" fill="#e0aaff" />
    <circle cx="39.5" cy="27.5" r="1.5" fill="#e0aaff" />

    {/* Mouth */}
    <path
      d="M24 36 Q32 42 40 36"
      stroke="#a855f7"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default UvixBotLogo;
