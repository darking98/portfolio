import { ImageResponse } from 'next/og'

export const alt = 'Diego Gabriel Rodriguez - Senior Frontend Developer'
export const size = {
  width: 1200,
  height: 630
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'monospace',
        position: 'relative'
      }}
    >
      {/* Grid background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(109, 109, 109, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(109, 109, 109, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}
      />

      {/* Status indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#22c55e'
          }}
        />
        <span
          style={{
            color: '#e5e5e5',
            fontSize: '24px',
            letterSpacing: '-0.5px'
          }}
        >
          available for work
        </span>
      </div>

      {/* Name */}
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#ffffff',
          margin: '0 0 20px 0',
          letterSpacing: '-2px',
          position: 'relative',
          zIndex: 1
        }}
      >
        diego gabriel rodriguez
      </h1>

      {/* Title */}
      <p
        style={{
          fontSize: '42px',
          color: '#a3a3a3',
          margin: '0 0 40px 0',
          letterSpacing: '-1px',
          position: 'relative',
          zIndex: 1
        }}
      >
        Senior Frontend Developer
      </p>

      {/* Tech stack */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1
        }}
      >
        {['React', 'Next.js', 'TypeScript', 'Node.js', 'AI-First'].map(
          (tech) => (
            <span
              key={tech}
              style={{
                background: 'rgba(109, 109, 109, 0.2)',
                color: '#e5e5e5',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '24px',
                border: '1px solid rgba(109, 109, 109, 0.3)'
              }}
            >
              {tech}
            </span>
          )
        )}
      </div>

      {/* Location */}
      <p
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '80px',
          fontSize: '24px',
          color: '#737373',
          margin: 0
        }}
      >
        Buenos Aires, Argentina
      </p>

      {/* URL */}
      <p
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '80px',
          fontSize: '24px',
          color: '#737373',
          margin: 0
        }}
      >
        diegogabrielrodriguez.com
      </p>
    </div>,
    {
      ...size
    }
  )
}
