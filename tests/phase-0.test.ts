import test from "node:test";
import assert from "node:assert/strict";

import { createSessionToken, verifySessionToken } from "@/lib/auth/session-core";

test("session tokens round-trip and reject tampering", () => {
  const token = createSessionToken("customer_123");

  assert.deepEqual(verifySessionToken(token)?.subject, "customer_123");
  assert.equal(verifySessionToken(`${token}tampered`), null);
});