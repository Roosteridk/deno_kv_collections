export class Collection<T extends Doc> {
  kv: Deno.Kv;
  primaryKey: string | number | symbol;
  name?: string;

  constructor(init: TableInit<T>) {
    this.kv = init.kv;
    this.primaryKey = init.primaryKey || "id";
    this.name = init.name;
  }

  set(obj: T) {
    const val = obj[this.primaryKey] as Deno.KvKeyPart;
    if (!val) throw new Error("Missing primary key");
    const key = this.name ? [this.name, val] : [val];
    return this.kv.set(key, obj);
  }

  get(key: string) {
    return this.kv.get(this.name ? [this.name, key] : [key]);
  }

  list(options?: Deno.KvListOptions) {
    return this.kv.list({ prefix: this.name ? [this.name] : [] }, options);
  }
}

type Doc = Record<string | number | symbol, unknown>;

type AllowedKeys<T> = {
  [K in keyof T]: T[K] extends Deno.KvKeyPart ? K : never;
}[keyof T];

type TableInit<T> =
  & {
    kv: Deno.Kv;
    name?: string;
  }
  & (T extends { id: Deno.KvKeyPart } ? { primaryKey?: AllowedKeys<T> }
    : { primaryKey: AllowedKeys<T> });
