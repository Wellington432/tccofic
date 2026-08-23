export default function DecorativeStrip() {
  return (
    <div className="relative w-full h-28 sm:h-36 overflow-hidden select-none" aria-hidden="true">
      <svg
        viewBox="0 0 400 100"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
      >
        {/* alfaces crespas */}
        {[40, 130, 260, 340].map((cx, i) => (
          <g key={cx} transform={`translate(${cx} 92)`}>
            {[...Array(7)].map((_, j) => (
              <ellipse
                key={j}
                cx={0}
                cy={0}
                rx={26}
                ry={14}
                fill={j % 2 === 0 ? '#2E7D32' : '#4CAF50'}
                opacity={0.9}
                transform={`rotate(${j * 51} 0 0) translate(0 -6)`}
              />
            ))}
            <circle r="10" fill="#14532D" opacity={i % 2 === 0 ? 0.15 : 0} />
          </g>
        ))}

        {/* tomates */}
        {[90, 190, 300].map((cx) => (
          <g key={cx} transform={`translate(${cx} 88)`}>
            <circle r="16" fill="#D32F2F" />
            <circle r="16" fill="#B71C1C" opacity="0.15" cx="5" cy="5" />
            <path d="M-6 -14 Q0 -22 6 -14 Q0 -18 -6 -14 Z" fill="#2E7D32" />
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-bg-app to-transparent" />
    </div>
  )
}
