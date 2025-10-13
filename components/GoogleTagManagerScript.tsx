// components/GoogleTagManagerScript.tsx
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// O GTM ID deve ser definido nas variáveis de ambiente (.env.local)
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Esta função simula o evento pageview que o GTM usa para carregar as tags
function gtmPageview(url: string) {
  // A tipagem de 'window.dataLayer' agora é conhecida pelo TypeScript graças ao types/gtm.d.ts
  // Adicionamos uma checagem de typeof window !== 'undefined' para garantir que o código só 
  // rode no ambiente do navegador (Client Side).
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      page: url,
    });
  } else {
    // Console log útil para debug em ambiente de desenvolvimento
    console.log(`GTM dataLayer não disponível ou URL: ${url}`);
  }
}

/**
 * Componente cliente que carrega o script principal do GTM e rastreia navegações de página (SPA).
 */
export default function GoogleTagManagerScript() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Rastreamento de rotas (Pageviews)
  // Este useEffect roda sempre que a URL muda (navegação de SPA)
  useEffect(() => {
    if (!GTM_ID) return;
    
    // Constrói a URL completa para o evento pageview
    const url = `${pathname}${searchParams ? `?${searchParams}` : ''}`;
    gtmPageview(url);
  }, [pathname, searchParams]);

  if (!GTM_ID) {
    return null;
  }

  return (
    // Usa o next/script com estratégia 'afterInteractive' para otimizar a performance
    <Script
      id="gtm-script-head"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  );
}