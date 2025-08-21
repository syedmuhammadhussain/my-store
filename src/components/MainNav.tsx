// src/components/navigation/MainNav.tsx
import React from "react";
import MainNavClient from "./navigation/MainNavClient";
import StrapiService from "@/lib/strapi.service";
import type { CategoryAttributes } from "@/types/category";

// optionally cache the fetch result at module level (simple)
let cachedCategories: CategoryAttributes[] | null = null;

export default async function MainNav() {
  let categories: CategoryAttributes[] = [];

  try {
    if (!cachedCategories) {
      const res = await StrapiService.getCategoriesWithSubs();
      categories = (res.data ?? []) as unknown as CategoryAttributes[];
      cachedCategories = categories;
    } else {
      categories = cachedCategories;
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // dev-only server log
      // eslint-disable-next-line no-console
      console.error("Failed to fetch categories for MainNav:", err);
    }
    categories = [];
  }

  return <MainNavClient categories={categories} />;
}
