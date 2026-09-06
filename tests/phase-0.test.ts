import test from "node:test";
import assert from "node:assert/strict";

import { createSessionToken, verifySessionToken } from "@/lib/auth/session-core";
import { getStoreByKey, getStoreBySlug, resolveStore, storeConfigs } from "@/lib/stores";

test("session tokens round-trip and reject tampering", () => {
  const token = createSessionToken("customer_123");

  assert.deepEqual(verifySessionToken(token)?.subject, "customer_123");
  assert.equal(verifySessionToken(`${token}tampered`), null);
});

test("store resolution is centralized and case-insensitive", () => {
  assert.equal(getStoreBySlug("tigsbd")?.key, "TIGSBD");
  assert.equal(getStoreBySlug("SARONGO")?.key, "SARONGO");
  assert.equal(getStoreByKey("sarongo")?.slug, "sarongo");
  assert.equal(resolveStore("unknown-store"), null);
});

test("both initial stores have complete foundation configuration", () => {
  assert.deepEqual(storeConfigs.map((store) => store.slug), ["tigsbd", "sarongo"]);
  for (const store of storeConfigs) {
    assert.ok(store.name && store.description && store.logo);
    assert.ok(store.metadata.title && store.metadata.description);
    assert.ok(store.colors.accent && store.colors.accentSoft && store.colors.ink);
  }
});