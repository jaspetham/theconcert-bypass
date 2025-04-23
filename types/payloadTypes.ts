export interface selectedSeatsPayload {
  key: string;
  id: string | number;
  name: string;
}

export interface selectedVariantPayload {
  id: number;
  variant_id: number;
  quantity: number;
  sku?: string;
  price?: string | number;
  gate_open: Date;
  zone?: string;
  symbol?: string;
  currency_code?: string;
  gate_close?: Date;
  seats?: selectedSeatsPayload[];
}
export interface cartPayload {
  cart_id: number;
  products: selectedVariantPayload[];
}
