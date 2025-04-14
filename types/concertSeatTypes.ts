export interface AvailableSeatDataObj {
  seatData: any[];
  open_at?: string | number;
}

export interface Seat {
  id: string;
  status: "available" | "reserved" | "sold";
  [key: string]: any; // Allow additional properties
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
