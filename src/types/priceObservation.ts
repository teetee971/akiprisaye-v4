// src/types/priceObservation.ts
// Types pour les observations de prix factuelles

export type PriceObservation = {
  ean: string
  productName: string
  territory: string
  store: string
  price: number
  currency: 'EUR'
  observationDate: string // ISO
  source: 'ticket_scan' | 'agent_public' | 'open_data'
  sourceRef?: string
}

export type PriceAggregation = {
  ean: string
  productName: string
  minPrice: number
  maxPrice: number
  averagePrice: number
  observationCount: number
  periodStart: string
  periodEnd: string
  observations: PriceObservation[]
}

export type StoreComparison = {
  store: string
  territory: string
  observations: PriceObservation[]
}
