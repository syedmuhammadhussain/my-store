// src/components/navigation/MobileNavServer.tsx
import React from "react";
import MobileNav from "./MobileNav";
import StrapiService from "@/lib/strapi.service";
import type { CategoryAttributes } from "@/types/category";

export default async function MobileNavServer() {
  let categories: CategoryAttributes[] = [];

  try {
    const res = await StrapiService.getCategoriesWithSubs();
    categories = (res.data ?? []) as unknown as CategoryAttributes[];
  } catch (err) {
    // dev-only log
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("MobileNavServer: failed to fetch categories", err);
    }
    categories = [];
  }

  return <MobileNav categories={categories} />;
}
