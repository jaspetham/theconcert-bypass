export interface ConcertRoundsResponse {
  data: Data;
  bench: Bench;
}

export interface Bench {
  second: number;
  millisecond: number;
  format: string;
}

export interface Data {
  pagination: Pagination;
  record: Round[];
  cache: boolean;
  key_cache: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  limit: number;
  total: number;
}

export interface Round {
  id: number;
  name: Name;
  description_short: DescriptionShort;
  store: Store;
  venue: Venue;
  show_time: ShowTime;
  price: Price;
  images: Image[];
  variants: Variant[];
  remain: number;
  soldout_status: boolean;
  sales_status: boolean;
  sales_url: null;
  group_type: string;
}

export interface DescriptionShort {}

export interface Image {
  id: string;
  tag: string;
  name: string;
  mime: string;
}

export interface Name {
  th: null | string;
  en: null | string;
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
  image: DescriptionShort;
  venue: DescriptionShort;
}

export interface Section {
  id: number;
  text: string;
}

export interface Variant {
  published_start: Date;
  published_end: Date;
}

export interface Venue {
  address: Name;
  name: Name;
  lat: number;
  long: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toConcertRoundsResponse(
    json: string
  ): ConcertRoundsResponse {
    return cast(
      JSON.parse(json),
      r("ConcertRoundsResponse")
    );
  }

  public static ConcertRoundsResponseToJson(
    value: ConcertRoundsResponse
  ): string {
    return JSON.stringify(
      uncast(value, r("ConcertRoundsResponse")),
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
  ConcertRoundsResponse: o(
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
      { json: "pagination", js: "pagination", typ: r("Pagination") },
      { json: "record", js: "record", typ: a(r("Record")) },
      { json: "cache", js: "cache", typ: true },
      { json: "key_cache", js: "key_cache", typ: "" },
    ],
    false
  ),
  Pagination: o(
    [
      { json: "current_page", js: "current_page", typ: 0 },
      { json: "last_page", js: "last_page", typ: 0 },
      { json: "limit", js: "limit", typ: 0 },
      { json: "total", js: "total", typ: 0 },
    ],
    false
  ),
  Record: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: r("Name") },
      {
        json: "description_short",
        js: "description_short",
        typ: r("DescriptionShort"),
      },
      { json: "store", js: "store", typ: r("Store") },
      { json: "venue", js: "venue", typ: r("Venue") },
      { json: "show_time", js: "show_time", typ: r("ShowTime") },
      { json: "price", js: "price", typ: r("Price") },
      { json: "images", js: "images", typ: a(r("Image")) },
      { json: "variants", js: "variants", typ: a(r("Variant")) },
      { json: "remain", js: "remain", typ: 0 },
      { json: "soldout_status", js: "soldout_status", typ: true },
      { json: "sales_status", js: "sales_status", typ: true },
      { json: "sales_url", js: "sales_url", typ: null },
      { json: "group_type", js: "group_type", typ: "" },
    ],
    false
  ),
  DescriptionShort: o([], false),
  Image: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "tag", js: "tag", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "mime", js: "mime", typ: "" },
    ],
    false
  ),
  Name: o(
    [
      { json: "th", js: "th", typ: u(null, "") },
      { json: "en", js: "en", typ: u(null, "") },
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
      { json: "image", js: "image", typ: r("DescriptionShort") },
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
  Variant: o(
    [
      { json: "published_start", js: "published_start", typ: Date },
      { json: "published_end", js: "published_end", typ: Date },
    ],
    false
  ),
  Venue: o(
    [
      { json: "address", js: "address", typ: r("Name") },
      { json: "name", js: "name", typ: r("Name") },
      { json: "lat", js: "lat", typ: 3.14 },
      { json: "long", js: "long", typ: 3.14 },
    ],
    false
  ),
};
