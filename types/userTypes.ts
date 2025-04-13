export interface UserProfileReponse {
  statusCode: number;
  response: UserInterface;
}

export interface UserInterface {
  id: number;
  username: string;
  country_code: null;
  display_name: null;
  avatar: Avatar;
  gender: string;
  first_name: string;
  last_name: string;
  register_type: Accept;
  exp: number;
  level: Level;
  email: string;
  phone: string;
  phone_country_code: string;
  idcard: null;
  birthday: Date;
  terms_accepted: boolean;
  activated: boolean;
  activated_at: Date;
  blocked: boolean;
  has_passcode: boolean;
  is_verify: Accept;
  profile_score: number;
  last_login_at: Date;
  last_login_ip: string;
  created_at: Date;
  updated_at: Date;
  referral: string;
  lang: string;
  wallet: Wallet;
  group: Group;
  agent: Agent;
  connects: Connect[];
  covid_verify: null;
  accept: Accept;
  cache: boolean;
}

export interface Accept {
  id: number;
  text: string;
}

export interface Agent {}

export interface Avatar {
  id: string;
  name: string;
  width: number;
  height: number;
  mime: string;
  size: number;
  url: string;
  resize_url: string;
}

export interface Connect {
  id: number;
  service: string;
  uid: string;
  account: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface Level {
  id: number;
  name: string;
  exp_min: number;
  exp_max: number;
  coin: number;
}

export interface Wallet {
  id: number;
  amount: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toUserProfileReponse(
    json: string
  ): UserProfileReponse {
    return cast(
      JSON.parse(json),
      r("UserProfileReponse")
    );
  }

  public static UserProfileReponseToJson(
    value: UserProfileReponse
  ): string {
    return JSON.stringify(
      uncast(value, r("UserProfileReponse")),
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
  UserProfileReponse: o(
    [
      { json: "statusCode", js: "statusCode", typ: 0 },
      { json: "response", js: "response", typ: r("Response") },
    ],
    false
  ),
  Response: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "username", js: "username", typ: "" },
      { json: "country_code", js: "country_code", typ: null },
      { json: "display_name", js: "display_name", typ: null },
      { json: "avatar", js: "avatar", typ: r("Avatar") },
      { json: "gender", js: "gender", typ: "" },
      { json: "first_name", js: "first_name", typ: "" },
      { json: "last_name", js: "last_name", typ: "" },
      { json: "register_type", js: "register_type", typ: r("Accept") },
      { json: "exp", js: "exp", typ: 0 },
      { json: "level", js: "level", typ: r("Level") },
      { json: "email", js: "email", typ: "" },
      { json: "phone", js: "phone", typ: "" },
      { json: "phone_country_code", js: "phone_country_code", typ: "" },
      { json: "idcard", js: "idcard", typ: null },
      { json: "birthday", js: "birthday", typ: Date },
      { json: "terms_accepted", js: "terms_accepted", typ: true },
      { json: "activated", js: "activated", typ: true },
      { json: "activated_at", js: "activated_at", typ: Date },
      { json: "blocked", js: "blocked", typ: true },
      { json: "has_passcode", js: "has_passcode", typ: true },
      { json: "is_verify", js: "is_verify", typ: r("Accept") },
      { json: "profile_score", js: "profile_score", typ: 0 },
      { json: "last_login_at", js: "last_login_at", typ: Date },
      { json: "last_login_ip", js: "last_login_ip", typ: "" },
      { json: "created_at", js: "created_at", typ: Date },
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "referral", js: "referral", typ: "" },
      { json: "lang", js: "lang", typ: "" },
      { json: "wallet", js: "wallet", typ: r("Wallet") },
      { json: "group", js: "group", typ: r("Group") },
      { json: "agent", js: "agent", typ: r("Agent") },
      { json: "connects", js: "connects", typ: a(r("Connect")) },
      { json: "covid_verify", js: "covid_verify", typ: null },
      { json: "accept", js: "accept", typ: r("Accept") },
      { json: "cache", js: "cache", typ: true },
    ],
    false
  ),
  Accept: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "text", js: "text", typ: "" },
    ],
    false
  ),
  Agent: o([], false),
  Avatar: o(
    [
      { json: "id", js: "id", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "width", js: "width", typ: 0 },
      { json: "height", js: "height", typ: 0 },
      { json: "mime", js: "mime", typ: "" },
      { json: "size", js: "size", typ: 0 },
      { json: "url", js: "url", typ: "" },
      { json: "resize_url", js: "resize_url", typ: "" },
    ],
    false
  ),
  Connect: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "service", js: "service", typ: "" },
      { json: "uid", js: "uid", typ: "" },
      { json: "account", js: "account", typ: "" },
    ],
    false
  ),
  Group: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  Level: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "name", js: "name", typ: "" },
      { json: "exp_min", js: "exp_min", typ: 0 },
      { json: "exp_max", js: "exp_max", typ: 0 },
      { json: "coin", js: "coin", typ: 0 },
    ],
    false
  ),
  Wallet: o(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "amount", js: "amount", typ: 0 },
    ],
    false
  ),
};
