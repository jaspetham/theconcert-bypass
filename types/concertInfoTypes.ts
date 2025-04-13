export interface ConcertInfoResponse {
  data: ConcertInfo;
  bench: Bench;
}

export interface Bench {
  second: number;
  millisecond: number;
  format: string;
}

export interface ConcertInfo {
  id: number;
  parent_id: number;
  variants: any[];
  name: Description;
  description_short: DescriptionShort;
  attributes: Attribute[];
  venue: Venue;
  show_time: ShowTime;
  images: Image[];
  store: Store;
  price: Price;
  remain: number;
  sales_status: boolean;
  sales_url: null;
  soldout_status: boolean;
  group_type: string;
  webview_url: string;
  viewed: number;
  stage: DescriptionShort;
  share_url: string;
  is_redeem: boolean;
  type: string;
  survey_status: boolean;
  is_mission: boolean;
  description: Description;
  has_variant_status: boolean;
  ticket_shipping: boolean;
  settings: Settings;
  presale_status: boolean;
  presale_info_status: boolean;
  enable_user_online: boolean;
  cache: boolean;
}

export interface Attribute {
  id: number;
  code: string;
  name: Description;
  items: Item[];
}

export interface Item {
  id: number;
  name: Description;
  value: null;
}

export interface Description {
  th: null | string;
  en: null | string;
}

export interface DescriptionShort {}

export interface Image {
  id: string;
  store_id: number;
  tag?: string;
  album_id: number;
  name: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  url: string;
  position?: number;
}

export interface Price {
  currency_code: string;
  currency_value: number;
  symbol_left: string;
  symbol_right: string;
  currency_symbol: string;
  min: number;
  max: number;
  min_text: string;
  max_text: string;
  compare_min: number;
  compare_max: number;
  compare_min_text: string;
  compare_max_text: string;
  status: boolean;
}

export interface Settings {
  payment: Payment;
}

export interface Payment {
  fee: Fee;
  method: Method;
  setting: Setting;
  account: Account;
}

export interface Account {
  omise: string;
}

export interface Fee {
  service_fee: ServiceFee;
  payment_fee: PaymentFee;
  tax_fee: TaxFee;
}

export interface PaymentFee {
  organizer_pay: number;
  customer_pay: number;
}

export interface ServiceFee {
  organizer_pay: string;
  customer_pay: number;
}

export interface TaxFee {
  organizer_pay: boolean;
  customer_pay: boolean;
}

export interface Method {
  ccw: Bill;
  ibanking: Bill;
  mbanking: DescriptionShort;
  banktrans: Banktrans;
  bill: Bill;
  promptpay: Bill;
  installment: DescriptionShort;
  linepay: DescriptionShort;
  alipay: DescriptionShort;
  truemoney: DescriptionShort;
}

export interface Banktrans {
  status: boolean;
  expired: string;
  store_bank_id: string;
}

export interface Bill {
  status: boolean;
}

export interface Setting {
  free: Free;
  paid: Free;
  ga: string;
  fb_pixel: string;
  how_to_buy: string;
}

export interface Free {
  total: number;
  payment_fee: number;
  service_fee: number;
}

export interface ShowTime {
  start: Date;
  end: Date;
  text_full: string;
  text_short: string;
  text_short_date: string;
  status: number;
  status_text: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  type: Section;
  section: Section;
  status: boolean;
  image: Image;
  venue: DescriptionShort;
}

export interface Section {
  id: number;
  text: string;
}

export interface Venue {
  id: number;
  lat: number;
  long: number;
  name: Description;
  address: Description;
  meta_title: Description;
  meta_description: Description;
  meta_keyword: Description;
  country: Country;
  province: City;
  city: City;
  district: City;
  zip_code: number;
}

export interface City {
  id: number;
  name: Description;
}

export interface Country {
  id: number;
  name: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toConcertInfoResponse(
    json: string
  ): ConcertInfoResponse {
    return cast(
      JSON.parse(json),
      r("ConcertInfoResponse")
    );
  }

  public static ConcertInfoResponseToJson(
    value: ConcertInfoResponse
  ): string {
    return JSON.stringify(
      uncast(value, r("ConcertInfoResponse")),
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
  ConcertInfoResponse: o(
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
      { json: "parent_id", js: "parent_id", typ: 0 },
      { json: "variants", js: "variants", typ: a("any") },
      { json: "name", js: "name", typ: r("Description") },
      {
        json: "description_short",
        js: "description_short",
        typ: r("DescriptionShort"),
      },
      { json: "attributes", js: "attributes", typ: a(r("Attribute")) },
      { json: "venue", js: "venue", typ: r("Venue") },
      { json: "show_time", js: "show_time", typ: r("ShowTime") },
      { json: "images", js: "images", typ: a(r("Image")) },
      { json: "store", js: "store", typ: r("Store") },
      { json: "price", js: "price", typ: r("Price") },
      { json: "remain", js: "remain", typ: 0 },
      { json: "sales_status", js: "sales_status", typ: true },
      { json: "sales_url", js: "sales_url", typ: null },
      { json: "soldout_status", js: "soldout_status", typ: true },
      { json: "group_type", js: "group_type", typ: "" },
      { json: "webview_url", js: "webview_url", typ: "" },
      { json: "viewed", js: "viewed", typ: 0 },
      { json: "stage", js: "stage", typ: r("DescriptionShort") },
      { json: "share_url", js: "share_url", typ: "" },
      { json: "is_redeem", js: "is_redeem", typ: true },
      { json: "type", js: "type", typ: "" },
      { json: "survey_status", js: "survey_status", typ: true },
      { json: "is_mission", js: "is_mission", typ: true },
      { json: "description", js: "description", typ: r("Description") },
      { json: "has_variant_status", js: "has_variant_status", typ: true },
      { json: "ticket_shipping", js: "ticket_shipping", typ: true },
      { json: "settings", js: "settings", typ: r("Settings") },
      { json: "presale_status", js: "presale_status", typ: true },
      { json: "presale_info_status", js: "presale_info_status", typ: true },
      { json: "enable_user_online", js: "enable_user_online", typ: true },
      { json: "cache", js: "cache", typ: true },
    ],
    false
  ),
  Attribute: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "code", js: "code", typ: "" },
      { json: "name", js: "name", typ: r("Description") },
      { json: "items", js: "items", typ: a(r("Item")) },
    ],
    false
  ),
  Item: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: r("Description") },
      { json: "value", js: "value", typ: null },
    ],
    false
  ),
  Description: o(
    [
      { json: "th", js: "th", typ: u(null, "") },
      { json: "en", js: "en", typ: u(null, "") },
    ],
    false
  ),
  DescriptionShort: o([], false),
  Image: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "store_id", js: "store_id", typ: 0 },
      { json: "tag", js: "tag", typ: u(undefined, "") },
      { json: "album_id", js: "album_id", typ: 0 },
      { json: "name", js: "name", typ: "" },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "mime", js: "mime", typ: "" },
      { json: "size", js: "size", typ: 0 },
      { json: "url", js: "url", typ: "" },
      { json: "position", js: "position", typ: u(undefined, 0) },
    ],
    false
  ),
  Price: o(
    [
      { json: "currency_code", js: "currency_code", typ: "" },
      { json: "currency_value", js: "currency_value", typ: 0 },
      { json: "symbol_left", js: "symbol_left", typ: "" },
      { json: "symbol_right", js: "symbol_right", typ: "" },
      { json: "currency_symbol", js: "currency_symbol", typ: "" },
      { json: "min", js: "min", typ: 0 },
      { json: "max", js: "max", typ: 0 },
      { json: "min_text", js: "min_text", typ: "" },
      { json: "max_text", js: "max_text", typ: "" },
      { json: "compare_min", js: "compare_min", typ: 0 },
      { json: "compare_max", js: "compare_max", typ: 0 },
      { json: "compare_min_text", js: "compare_min_text", typ: "" },
      { json: "compare_max_text", js: "compare_max_text", typ: "" },
      { json: "status", js: "status", typ: true },
    ],
    false
  ),
  Settings: o([{ json: "payment", js: "payment", typ: r("Payment") }], false),
  Payment: o(
    [
      { json: "fee", js: "fee", typ: r("Fee") },
      { json: "method", js: "method", typ: r("Method") },
      { json: "setting", js: "setting", typ: r("Setting") },
      { json: "account", js: "account", typ: r("Account") },
    ],
    false
  ),
  Account: o([{ json: "omise", js: "omise", typ: "" }], false),
  Fee: o(
    [
      { json: "service_fee", js: "service_fee", typ: r("ServiceFee") },
      { json: "payment_fee", js: "payment_fee", typ: r("PaymentFee") },
      { json: "tax_fee", js: "tax_fee", typ: r("TaxFee") },
    ],
    false
  ),
  PaymentFee: o(
    [
      { json: "organizer_pay", js: "organizer_pay", typ: 0 },
      { json: "customer_pay", js: "customer_pay", typ: 0 },
    ],
    false
  ),
  ServiceFee: o(
    [
      { json: "organizer_pay", js: "organizer_pay", typ: "" },
      { json: "customer_pay", js: "customer_pay", typ: 0 },
    ],
    false
  ),
  TaxFee: o(
    [
      { json: "organizer_pay", js: "organizer_pay", typ: true },
      { json: "customer_pay", js: "customer_pay", typ: true },
    ],
    false
  ),
  Method: o(
    [
      { json: "ccw", js: "ccw", typ: r("Bill") },
      { json: "ibanking", js: "ibanking", typ: r("Bill") },
      { json: "mbanking", js: "mbanking", typ: r("DescriptionShort") },
      { json: "banktrans", js: "banktrans", typ: r("Banktrans") },
      { json: "bill", js: "bill", typ: r("Bill") },
      { json: "promptpay", js: "promptpay", typ: r("Bill") },
      { json: "installment", js: "installment", typ: r("DescriptionShort") },
      { json: "linepay", js: "linepay", typ: r("DescriptionShort") },
      { json: "alipay", js: "alipay", typ: r("DescriptionShort") },
      { json: "truemoney", js: "truemoney", typ: r("DescriptionShort") },
    ],
    false
  ),
  Banktrans: o(
    [
      { json: "status", js: "status", typ: true },
      { json: "expired", js: "expired", typ: "" },
      { json: "store_bank_id", js: "store_bank_id", typ: "" },
    ],
    false
  ),
  Bill: o([{ json: "status", js: "status", typ: true }], false),
  Setting: o(
    [
      { json: "free", js: "free", typ: r("Free") },
      { json: "paid", js: "paid", typ: r("Free") },
      { json: "ga", js: "ga", typ: "" },
      { json: "fb_pixel", js: "fb_pixel", typ: "" },
      { json: "how_to_buy", js: "how_to_buy", typ: "" },
    ],
    false
  ),
  Free: o(
    [
      { json: "total", js: "total", typ: 0 },
      { json: "payment_fee", js: "payment_fee", typ: 0 },
      { json: "service_fee", js: "service_fee", typ: 0 },
    ],
    false
  ),
  ShowTime: o(
    [
      { json: "start", js: "start", typ: Date },
      { json: "end", js: "end", typ: Date },
      { json: "text_full", js: "text_full", typ: "" },
      { json: "text_short", js: "text_short", typ: "" },
      { json: "text_short_date", js: "text_short_date", typ: "" },
      { json: "status", js: "status", typ: 0 },
      { json: "status_text", js: "status_text", typ: "" },
    ],
    false
  ),
  Store: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: "" },
      { json: "slug", js: "slug", typ: "" },
      { json: "type", js: "type", typ: r("Section") },
      { json: "section", js: "section", typ: r("Section") },
      { json: "status", js: "status", typ: true },
      { json: "image", js: "image", typ: r("Image") },
      { json: "venue", js: "venue", typ: r("DescriptionShort") },
    ],
    false
  ),
  Section: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "text", js: "text", typ: "" },
    ],
    false
  ),
  Venue: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "lat", js: "lat", typ: 3.14 },
      { json: "long", js: "long", typ: 3.14 },
      { json: "name", js: "name", typ: r("Description") },
      { json: "address", js: "address", typ: r("Description") },
      { json: "meta_title", js: "meta_title", typ: r("Description") },
      {
        json: "meta_description",
        js: "meta_description",
        typ: r("Description"),
      },
      { json: "meta_keyword", js: "meta_keyword", typ: r("Description") },
      { json: "country", js: "country", typ: r("Country") },
      { json: "province", js: "province", typ: r("City") },
      { json: "city", js: "city", typ: r("City") },
      { json: "district", js: "district", typ: r("City") },
      { json: "zip_code", js: "zip_code", typ: 0 },
    ],
    false
  ),
  City: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: r("Description") },
    ],
    false
  ),
  Country: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
};
