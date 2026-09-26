import assert from "node:assert/strict";
import test from "node:test";
import { getContributors } from "./github-contributors.ts";

const person = (id, type = "User") => ({
  id,
  login: `person-${id}`,
  avatar_url: "https://example.com/avatar.png",
  html_url: "https://example.com/profile",
  contributions: 1,
  type,
});

test("loads all pages and filters non-user accounts", async () => {
  let calls = 0;
  const contributors = await getContributors(async () => {
    calls += 1;
    return Response.json(calls === 1 ? Array.from({ length: 100 }, (_, id) => person(id)) : [person(100), person(101, "Bot")]);
  });

  assert.equal(calls, 2);
  assert.equal(contributors.length, 101);
  assert.equal(contributors.at(-1)?.login, "person-100");
});

test("rejects invalid API data and failed requests", async () => {
  assert.deepEqual(await getContributors(async () => Response.json([{ id: "wrong" }])), []);
  assert.deepEqual(await getContributors(async () => new Response(null, { status: 503 })), []);
});
