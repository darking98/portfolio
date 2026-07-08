export const WORDS_LOADING = [
  'hello...',
  'thinking...',
  'designing...',
  'creating...'
]
export const WORDS_WAITING = [
  'optimizing...',
  'rendering...',
  'compiling...',
  'polishing...'
]
export const WORD_DONE = 'done.'
export const ALL_WORDS = [...WORDS_LOADING, ...WORDS_WAITING, WORD_DONE]

export interface LoaderProps {
  resumeRef: { current: (() => void) | null }
  onReady: () => void
  onComplete: () => void
}

export const wordStyle: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
  fontWeight: 700,
  fontStyle: 'italic',
  color: '#e8e0d5',
  letterSpacing: '0.06em',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap'
}
