interface SmilingFaceProps {
  faceRef?: React.RefObject<HTMLDivElement | null>
  winkEyeRef: React.RefObject<SVGGElement | null>
  size?: number | string
  color?: string
  className?: string
  style?: React.CSSProperties
  onMouseEnter?: () => void
}

const SmilingFace = ({
  faceRef,
  winkEyeRef,
  size = 96,
  color = '#e8e0d5',
  className = 'absolute inset-0 flex items-center justify-center pointer-events-none',
  style,
  onMouseEnter
}: SmilingFaceProps) => {
  return (
    <div
      ref={faceRef}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        style={{ width: size, height: size, display: 'block' }}
      >
        {/* ojo izquierdo */}
        <circle cx="36" cy="40" r="5.5" fill={color} />
        {/* ojo derecho (guiña) */}
        <g ref={winkEyeRef}>
          <circle cx="64" cy="40" r="5.5" fill={color} />
        </g>
        {/* sonrisa */}
        <path
          d="M32 58 Q50 76 68 58"
          stroke={color}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default SmilingFace
