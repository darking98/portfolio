import '../styles/globals.css'
import { ViewTransitions } from 'next-view-transitions'
import SmoothScroll from '@/components/SmoothScroll'
import Background from '@/components/Background'

export const metadata = {
  title: 'Diego Rodriguez — Fullstack Developer',
  description: 'Fullstack developer based in Buenos Aires. Building things that matter.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en">
      <body>
        {/* Bloquea el primer paint hasta que el Loader JS monte — evita flash del hero */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var d = document.createElement('div');
            d.id = '__loader_cover';
            d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#6B3040;pointer-events:none';
            document.documentElement.appendChild(d);
          })();
        ` }} />
        <Background />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
      </html>
    </ViewTransitions>
  )
}
