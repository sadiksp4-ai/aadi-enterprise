/**
 * Authoritative category -> customer-facing group mapping.
 *
 * This module is the single source of truth for the six `/products?group=`
 * values. Both the existing Products component and the catalogue data layer
 * consume it, so the UI filters and the data indexes can never drift apart.
 *
 * The public identifiers (`kitchen`, `fnb`, `hk`, `laundry`, `guest`, `cold`)
 * are part of the existing URL contract and must not change.
 */

import type { CatalogueGroupId } from "./catalogue.types";

/** Stable order used by the filter tabs and the catalogue indexes. */
export const CATALOGUE_GROUP_ORDER: readonly CatalogueGroupId[] = [
  "kitchen",
  "fnb",
  "hk",
  "laundry",
  "guest",
  "cold",
];

export const CATALOGUE_GROUP_LABELS: Readonly<
  Record<CatalogueGroupId, string>
> = {
  kitchen: "Kitchen",
  fnb: "Food & Beverage",
  hk: "Housekeeping & Hygiene",
  laundry: "Laundry",
  guest: "Guest Experience",
  cold: "Refrigeration & Cold Chain",
};

export interface CatalogueGroupDescriptor {
  readonly id: CatalogueGroupId;
  readonly label: string;
}

/** The six real groups, without the synthetic `all` option. */
export const CATALOGUE_GROUPS: readonly CatalogueGroupDescriptor[] =
  CATALOGUE_GROUP_ORDER.map((id) => ({
    id,
    label: CATALOGUE_GROUP_LABELS[id],
  }));

/** Filter options for the existing tab bar, including `all`. */
export interface CatalogueGroupOption {
  readonly id: CatalogueGroupId | "all";
  readonly label: string;
}

export const CATALOGUE_GROUP_OPTIONS: readonly CatalogueGroupOption[] = [
  { id: "all", label: "All" },
  ...CATALOGUE_GROUPS,
];

/**
 * Maps a source category (and, for in-room amenities, the record name) to a
 * customer-facing group. Behaviour is identical to the mapping that shipped in
 * `Products.tsx`, including the two refrigeration records that live under the
 * in-room category.
 */
export function resolveGroup(
  sourceCategoryId: string,
  recordName: string
): CatalogueGroupDescriptor {
  if (sourceCategoryId === "commercial-kitchen") {
    return { id: "kitchen", label: CATALOGUE_GROUP_LABELS.kitchen };
  }
  if (sourceCategoryId === "fnb-service") {
    return { id: "fnb", label: CATALOGUE_GROUP_LABELS.fnb };
  }
  if (sourceCategoryId === "housekeeping-solutions") {
    return { id: "hk", label: CATALOGUE_GROUP_LABELS.hk };
  }
  if (sourceCategoryId === "laundry-solutions") {
    return { id: "laundry", label: CATALOGUE_GROUP_LABELS.laundry };
  }
  if (sourceCategoryId === "leather-products") {
    return { id: "guest", label: CATALOGUE_GROUP_LABELS.guest };
  }
  if (sourceCategoryId === "in-room-amenities") {
    if (recordName === "Elanpro" || recordName === "Ice Make") {
      return { id: "cold", label: CATALOGUE_GROUP_LABELS.cold };
    }
    return { id: "guest", label: CATALOGUE_GROUP_LABELS.guest };
  }
  return { id: "guest", label: CATALOGUE_GROUP_LABELS.guest };
}

export function resolveGroupId(
  sourceCategoryId: string,
  recordName: string
): CatalogueGroupId {
  return resolveGroup(sourceCategoryId, recordName).id;
}
