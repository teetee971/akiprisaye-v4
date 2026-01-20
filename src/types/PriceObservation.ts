export interface PriceObservation {
  productId: string;
  productLabel: string;
  territory: string;
  storeLabel: string;
  price: number;
  currency: 'EUR';
  observedAt: string;
  sourceType: 'citizen' | 'open_data' | 'partner';
  confidenceScore: number;
  observationsCount: number;
}
