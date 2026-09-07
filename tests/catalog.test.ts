import test from "node:test";
import assert from "node:assert/strict";

import { getStoreProduct, listStoreCategories, listStoreProducts, resolveCatalogStore } from "@/lib/catalog";
import { getStoreBySlug } from "@/lib/stores";

test("store hierarchy identifies TIGSBD as default main and Sarongo as sub", () => {
  const tigsbd = getStoreBySlug("tigsbd");
  const sarongo = getStoreBySlug("sarongo");
  assert.equal(tigsbd?.role, "main");
  assert.equal(tigsbd?.isDefault, true);
  assert.equal(sarongo?.role, "sub");
  assert.equal(sarongo?.isDefault, false);
});

test("catalog products and categories remain isolated by store", async () => {
  const tigsbd = await resolveCatalogStore("tigsbd");
  const sarongo = await resolveCatalogStore("sarongo");
  assert.ok(tigsbd && sarongo);

  const [tigsbdProducts, sarongoProducts, tigsbdCategories, sarongoCategories] = await Promise.all([
    listStoreProducts(tigsbd),
    listStoreProducts(sarongo),
    listStoreCategories(tigsbd),
    listStoreCategories(sarongo),
  ]);
  assert.ok(tigsbdProducts.length > 0 && sarongoProducts.length > 0);
  assert.ok(tigsbdProducts.every(({ product }) => product.storeId === tigsbd.id));
  assert.ok(sarongoProducts.every(({ product }) => product.storeId === sarongo.id));
  assert.ok(tigsbdCategories.every((category) => category.storeId === tigsbd.id));
  assert.ok(sarongoCategories.every((category) => category.storeId === sarongo.id));

  const sarongoProductSlug = sarongoProducts[0].product.slug;
  assert.equal(await getStoreProduct(tigsbd, sarongoProductSlug), null);
  assert.equal(await resolveCatalogStore("unknown"), null);
});