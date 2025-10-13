// types/gtm.d.ts

// Define a estrutura mínima do que o Google Tag Manager espera no dataLayer
type GtmDataLayer = Array<Record<string, unknown>>;

// Aumenta o escopo (merge) da interface Window global
// para incluir a propriedade dataLayer.
interface Window {
  dataLayer: GtmDataLayer;
}