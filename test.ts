import { Collection } from "./mod.ts";

const kv = await Deno.openKv();

const users = new Collection<{
  id: string; // Default key
  name: string;
  age: number;
}>({ kv });

users.set({
  id: "asdf",
  name: "asdf",
  age: 1,
});

console.log(await users.get("asdf"));
