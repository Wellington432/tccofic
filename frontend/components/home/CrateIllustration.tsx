export default function CrateIllustration() {
  return (
    <svg viewBox="0 0 240 200" className="w-full h-full" aria-hidden="true">
      {/* verduras/pimentões saindo do caixote */}
      <ellipse cx="70" cy="70" rx="34" ry="24" fill="#4CAF50" />
      <ellipse cx="115" cy="55" rx="30" ry="22" fill="#2E7D32" />
      <circle cx="150" cy="75" r="24" fill="#D32F2F" />
      <circle cx="175" cy="95" r="18" fill="#FBC02D" />
      <path d="M60 90 Q75 60 90 90" stroke="#14532D" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* caixote de madeira */}
      <g>
        <rect x="30" y="100" width="180" height="80" rx="6" fill="#C68642" />
        <rect x="30" y="100" width="180" height="80" rx="6" fill="#14532D" opacity="0.08" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={40 + i * 40}
            y1="100"
            x2={40 + i * 40}
            y2="180"
            stroke="#8D5A2B"
            strokeWidth="3"
          />
        ))}
        <rect x="30" y="100" width="180" height="12" fill="#A9702F" />
        <rect x="30" y="168" width="180" height="12" fill="#A9702F" />
      </g>
    </svg>
  )
}
