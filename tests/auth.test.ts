import test from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { authenticateCustomer, registerCustomer } from "@/lib/auth/service";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

test("registration normalizes email and stores only a bcrypt hash", async () => {
  const email = `phase2-${crypto.randomUUID()}@example.test`;
  const user = await registerCustomer({ email: `  ${email.toUpperCase()} `, password: "SecurePass123", firstName: "Demo", lastName: "Customer" });

  assert.ok(user);
  assert.equal(user.email, email);
  const [stored] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  assert.ok(stored);
  assert.notEqual(stored.passwordHash, "SecurePass123");
  assert.match(stored.passwordHash, /^\$2[aby]\$/);

  await db.delete(users).where(eq(users.id, user.id));
});

test("duplicate email and weak registration are rejected", async () => {
  const email = `phase2-duplicate-${crypto.randomUUID()}@example.test`;
  const first = await registerCustomer({ email, password: "SecurePass123", firstName: "First", lastName: "Customer" });
  assert.ok(first);

  const duplicate = await registerCustomer({ email: email.toUpperCase(), password: "SecurePass123", firstName: "Second", lastName: "Customer" });
  const weak = await registerCustomer({ email: `weak-${email}`, password: "short", firstName: "Weak", lastName: "Password" });
  assert.equal(duplicate, null);
  assert.equal(weak, null);

  await db.delete(users).where(eq(users.id, first.id));
});

test("login accepts valid credentials and rejects invalid credentials", async () => {
  const email = `phase2-login-${crypto.randomUUID()}@example.test`;
  const user = await registerCustomer({ email, password: "SecurePass123", firstName: "Login", lastName: "Customer" });
  assert.ok(user);

  assert.equal((await authenticateCustomer({ email: email.toUpperCase(), password: "SecurePass123" }))?.id, user.id);
  assert.equal(await authenticateCustomer({ email, password: "WrongPass123" }), null);

  await db.delete(users).where(eq(users.id, user.id));
});