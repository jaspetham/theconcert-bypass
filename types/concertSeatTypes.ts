export interface AvailableSeatDataObj {
  seatData: Seat[];
  open_at?: string | number;
}
export interface Seat {
  group_id: number;
  id: number;
  meta: string;
  name: string;
  open_at: number;
  product_id: number;
  product_variant_id: number;
  status: "available" | "reserved" | "sold";
}

export interface WebSocketMessage {
  t: "h" | "c" | "d";
  d?: {
    r?: number;
    a?: string;
    b?: {
      p?: string;
      d?: Record<string, any>;
    };
  };
}
