export interface ConcertVariantResponse {
  data: ConcertVariantInterface;
  bench: Bench;
}

export interface Bench {
  second: number;
  millisecond: number;
  format: string;
}
export interface Meta {
  path?: string;
  stage: {
    name: string;
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}
export interface ConcertVariantInterface {
  id: number;
  product_id: number;
  sku: string;
  name: string;
  description: null;
  group: string;
  zone: string;
  cost_price: number;
  cost_price_text: number;
  price: number;
  price_text: number;
  compare_at_price: number;
  compare_at_price_text: number;
  package: boolean;
  per_package: number;
  stock: number;
  quantity: number;
  order_quantity: number;
  diff_stock: number;
  hold: number;
  position: number;
  points: number;
  weight: number;
  status: boolean;
  soldout_status: boolean;
  soldout_status_id: number;
  published_start: Date;
  published_end: Date;
  gate_open: Date;
  gate_close: Date;
  published_start_raw: Date;
  published_end_raw: Date;
  presale_start_raw: null;
  presale_end_raw: null;
  gate_open_raw: Date;
  gate_close_raw: Date;
  allow_order_min: number;
  allow_order_max: number;
  remark: null;
  special_option: boolean;
  service_charge: boolean;
  service_fee: number;
  has_ticket: boolean;
  service: Service;
  options: any[];
  promotions: any[];
  image: Image;
  online_meeting: boolean;
  meetings: any[];
  meta: string | Meta | null;
  is_child: number;
  display_status: boolean;
  display_text: string;
  cache: boolean;
  sub_variants: any[];
}

export interface Image {}

export interface Service {
  charge: boolean;
  fee_value: number;
  fee: number;
  fee_text: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toConcertVariantResponse(
    json: string
  ): ConcertVariantResponse {
    return cast(
      JSON.parse(json),
      r("ConcertVariantResponse")
    );
  }

  public static ConcertVariantsResposeToJson(
    value: ConcertVariantResponse
  ): string {
    return JSON.stringify(
      uncast(value, r("ConcertVariantResponse")),
      null,
      2
    );
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = ""
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  ConcertVariantResponse: o(
    [
      { json: "data", js: "data", typ: r("Data") },
      { json: "bench", js: "bench", typ: r("Bench") },
    ],
    false
  ),
  Bench: o(
    [
      { json: "second", js: "second", typ: 0 },
      { json: "millisecond", js: "millisecond", typ: 3.14 },
      { json: "format", js: "format", typ: "" },
    ],
    false
  ),
  Data: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "product_id", js: "product_id", typ: 0 },
      { json: "sku", js: "sku", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "description", js: "description", typ: null },
      { json: "group", js: "group", typ: "" },
      { json: "zone", js: "zone", typ: "" },
      { json: "cost_price", js: "cost_price", typ: 0 },
      { json: "cost_price_text", js: "cost_price_text", typ: 0 },
      { json: "price", js: "price", typ: 0 },
      { json: "price_text", js: "price_text", typ: 0 },
      { json: "compare_at_price", js: "compare_at_price", typ: 0 },
      { json: "compare_at_price_text", js: "compare_at_price_text", typ: 0 },
      { json: "package", js: "package", typ: true },
      { json: "per_package", js: "per_package", typ: 0 },
      { json: "stock", js: "stock", typ: 0 },
      { json: "quantity", js: "quantity", typ: 0 },
      { json: "order_quantity", js: "order_quantity", typ: 0 },
      { json: "diff_stock", js: "diff_stock", typ: 0 },
      { json: "hold", js: "hold", typ: 0 },
      { json: "position", js: "position", typ: 0 },
      { json: "points", js: "points", typ: 0 },
      { json: "weight", js: "weight", typ: 0 },
      { json: "status", js: "status", typ: true },
      { json: "soldout_status", js: "soldout_status", typ: true },
      { json: "soldout_status_id", js: "soldout_status_id", typ: 0 },
      { json: "published_start", js: "published_start", typ: Date },
      { json: "published_end", js: "published_end", typ: Date },
      { json: "gate_open", js: "gate_open", typ: Date },
      { json: "gate_close", js: "gate_close", typ: Date },
      { json: "published_start_raw", js: "published_start_raw", typ: Date },
      { json: "published_end_raw", js: "published_end_raw", typ: Date },
      { json: "presale_start_raw", js: "presale_start_raw", typ: null },
      { json: "presale_end_raw", js: "presale_end_raw", typ: null },
      { json: "gate_open_raw", js: "gate_open_raw", typ: Date },
      { json: "gate_close_raw", js: "gate_close_raw", typ: Date },
      { json: "allow_order_min", js: "allow_order_min", typ: 0 },
      { json: "allow_order_max", js: "allow_order_max", typ: 0 },
      { json: "remark", js: "remark", typ: null },
      { json: "special_option", js: "special_option", typ: true },
      { json: "service_charge", js: "service_charge", typ: true },
      { json: "service_fee", js: "service_fee", typ: 0 },
      { json: "has_ticket", js: "has_ticket", typ: true },
      { json: "service", js: "service", typ: r("Service") },
      { json: "options", js: "options", typ: a("any") },
      { json: "promotions", js: "promotions", typ: a("any") },
      { json: "image", js: "image", typ: r("Image") },
      { json: "online_meeting", js: "online_meeting", typ: true },
      { json: "meetings", js: "meetings", typ: a("any") },
      { json: "meta", js: "meta", typ: "" },
      { json: "is_child", js: "is_child", typ: 0 },
      { json: "display_status", js: "display_status", typ: true },
      { json: "display_text", js: "display_text", typ: "" },
      { json: "cache", js: "cache", typ: true },
      { json: "sub_variants", js: "sub_variants", typ: a("any") },
    ],
    false
  ),
  Image: o([], false),
  Service: o(
    [
      { json: "charge", js: "charge", typ: true },
      { json: "fee_value", js: "fee_value", typ: 0 },
      { json: "fee", js: "fee", typ: 0 },
      { json: "fee_text", js: "fee_text", typ: "" },
    ],
    false
  ),
};
