export interface ConcertResponse {
  data: Data;
}

export interface Data {
  pagination: Pagination;
  record: ConcertInterface[];
}

export interface Pagination {
  current_page: number;
  last_page: number;
  limit: number;
  total: number;
}

export interface ConcertInterface {
  id: number;
  name: string;
  venue: Venue;
  show_time: ShowTime;
  soldout_status: boolean;
  sales_status: boolean;
  images: Image[];
}

export interface Image {
  id: string;
  tag: Tag;
  name: string;
  mime: MIME;
}

export enum MIME {
  ImageJPEG = "image/jpeg",
  ImagePNG = "image/png",
}

export enum Tag {
  Logo = "logo",
  SocialShare = "social-share",
}

export interface ShowTime {
  start: Date;
  end: Date;
  text_full: string;
  text_short: string;
  text_short_date: string;
  status: number;
  status_text: StatusText;
}

export enum StatusText {
  Available = "Available",
}

export interface Venue {
  address: null | string;
  name: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toConcertResponse(
    json: string
  ): ConcertResponse {
    return cast(
      JSON.parse(json),
      r("ConcertResponse")
    );
  }

  public static ConcertResponseToJson(
    value: ConcertResponse
  ): string {
    return JSON.stringify(
      uncast(value, r("ConcertResponse")),
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
  ConcertResponse: o(
    [{ json: "data", js: "data", typ: r("Data") }],
    false
  ),
  Data: o(
    [
      { json: "pagination", js: "pagination", typ: r("Pagination") },
      { json: "record", js: "record", typ: a(r("Record")) },
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
      { json: "name", js: "name", typ: "" },
      { json: "venue", js: "venue", typ: r("Venue") },
      { json: "show_time", js: "show_time", typ: r("ShowTime") },
      { json: "soldout_status", js: "soldout_status", typ: true },
      { json: "sales_status", js: "sales_status", typ: true },
      { json: "images", js: "images", typ: a(r("Image")) },
    ],
    false
  ),
  Image: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "tag", js: "tag", typ: r("Tag") },
      { json: "name", js: "name", typ: "" },
      { json: "mime", js: "mime", typ: r("MIME") },
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
      { json: "status_text", js: "status_text", typ: r("StatusText") },
    ],
    false
  ),
  Venue: o(
    [
      { json: "address", js: "address", typ: u(null, "") },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  MIME: ["image/jpeg", "image/png"],
  Tag: ["logo", "social-share"],
  StatusText: ["Available"],
};
