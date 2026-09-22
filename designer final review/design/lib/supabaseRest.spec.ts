import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import {
  PUBLISHED_FETCH_MAX_ATTEMPTS,
  PUBLISHED_FETCH_RETRY_AFTER_CAP_MS,
  fetchAnonPublishedJson,
} from "./supabaseRest";

const PREV_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PREV_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

before(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "spec-anon-key";
});

after(() => {
  if (PREV_URL === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_URL = PREV_URL;
  }
  if (PREV_KEY === undefined) {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  } else {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = PREV_KEY;
  }
});

function jsonResponse(status: number, body: unknown, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
  });
}

async function noWait(_ms: number): Promise<void> {
  return;
}

test("504 then 200 resolves with the payload and two attempts", async () => {
  const payload = [{ id: "row-1" }];
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    if (attempts === 1) return jsonResponse(504, { message: "gateway" });
    return jsonResponse(200, payload);
  };
  const result = await fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
    fetcher,
    sleep: noWait,
  });
  assert.deepEqual(result, payload);
  assert.equal(attempts, 2);
});

test("504 on every attempt throws after the bound with the status in the message", async () => {
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    return jsonResponse(504, { message: "gateway" });
  };
  await assert.rejects(
    () =>
      fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
        fetcher,
        sleep: noWait,
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /504/);
      assert.match(error.message, new RegExp(`after ${PUBLISHED_FETCH_MAX_ATTEMPTS} attempts`));
      return true;
    },
  );
  assert.equal(attempts, PUBLISHED_FETCH_MAX_ATTEMPTS);
});

test("400 throws on the first attempt with no retry", async () => {
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    return jsonResponse(400, { message: "bad request" });
  };
  await assert.rejects(
    () =>
      fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
        fetcher,
        sleep: noWait,
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /400/);
      assert.match(error.message, /after 1 attempts/);
      return true;
    },
  );
  assert.equal(attempts, 1);
});

test("404 throws on the first attempt with no retry", async () => {
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    return jsonResponse(404, { message: "missing" });
  };
  await assert.rejects(
    () =>
      fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
        fetcher,
        sleep: noWait,
      }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /404/);
      assert.match(error.message, /after 1 attempts/);
      return true;
    },
  );
  assert.equal(attempts, 1);
});

test("a network throw then a 200 resolves", async () => {
  const payload = [{ id: "row-2" }];
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    if (attempts === 1) throw new TypeError("fetch failed");
    return jsonResponse(200, payload);
  };
  const result = await fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
    fetcher,
    sleep: noWait,
  });
  assert.deepEqual(result, payload);
  assert.equal(attempts, 2);
});

test("429 carrying Retry-After waits no longer than the cap", async () => {
  const payload = [{ id: "row-3" }];
  const waits: number[] = [];
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    if (attempts === 1) {
      return jsonResponse(429, { message: "rate limited" }, { "Retry-After": "120" });
    }
    return jsonResponse(200, payload);
  };
  const result = await fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
    fetcher,
    sleep: async (ms) => {
      waits.push(ms);
    },
  });
  assert.deepEqual(result, payload);
  assert.equal(attempts, 2);
  assert.equal(waits.length, 1);
  assert.ok(waits[0] !== undefined);
  assert.ok(waits[0] <= PUBLISHED_FETCH_RETRY_AFTER_CAP_MS);
  assert.equal(waits[0], PUBLISHED_FETCH_RETRY_AFTER_CAP_MS);
});

test("a first-response 200 does not retry", async () => {
  const payload = [{ id: "row-ok" }];
  let attempts = 0;
  const fetcher: typeof fetch = async () => {
    attempts += 1;
    return jsonResponse(200, payload);
  };
  const result = await fetchAnonPublishedJson("Programme", "select=id", "force-cache", {
    fetcher,
    sleep: async () => {
      assert.fail("sleep must not run on a first-response 200");
    },
  });
  assert.deepEqual(result, payload);
  assert.equal(attempts, 1);
});
