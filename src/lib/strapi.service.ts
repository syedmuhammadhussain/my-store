// lib/strapi.service.ts
import qs from "qs";
import { LRUCache } from "lru-cache";
import { UploadedImage } from "@/types/image";
import { ProductVariant } from "@/types/variant";

const cache = new LRUCache<string, StrapiResponse<ProductListItem>>({
  max: 100,
  ttl: 1000 * 60 * 5,
});
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL ?? "http://localhost:1337";

/**
 * Generic shape of Strapi's REST response
 */
export interface StrapiResponse<T> {
  data: Array<{ id: number; attributes: T }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Options for building Strapi queries
 */
export interface StrapiQueryOptions {
  filters?: Record<string, unknown>;
  populate?: unknown;
  fields?: string[];
  sort?: string[];
  pagination?: { page?: number; pageSize?: number };
}

export default class StrapiService {
  /**
   * Low‑level fetch helper with typed return
   */
  private static async fetchData<T>(
    endpoint: string,
    queryOptions: StrapiQueryOptions = {}
  ): Promise<StrapiResponse<T>> {
    const query = qs.stringify(queryOptions, { encodeValuesOnly: true });
    const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ""}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Strapi API request failed: ${response.status}`);
    }

    const json = (await response.json()) as StrapiResponse<T>;
    return json;
  }

  /**
   * Fetch a single product by slug, including relations
   */
  static async getProductBySlug(
    slug: string
  ): Promise<StrapiResponse<TProductAttributes>> {
    return this.fetchData<TProductAttributes>("products", {
      filters: { slug: { $eq: slug } },
      populate: {
        images: { fields: ["formats"] },
        variants: {
          fields: ["size", "sku", "price"],
          populate: {
            inventory: { fields: ["label", "quantity", "total_items"] },
            images: { fields: ["formats"] },
            color: { fields: ["name"], populate: { swatch_image: true } },
          },
        },
        sub_category: { fields: ["name", "slug"] },
        discount: { fields: ["type", "value"] },
      },
    });
  }

  /**
   * Fetch category with its products
   */
  static async getCategoryWithProducts(
    slug: string
  ): Promise<StrapiResponse<CategoryWithProducts>> {
    return this.fetchData<CategoryWithProducts>("categories", {
      filters: { slug: { $eq: slug } },
      populate: { products: { populate: ["images", "variants"] } },
    });
  }

  /**
   * Cached fetch of products by category slug
   */
  static async getProductsByCategory(
    slug: string
  ): Promise<StrapiResponse<ProductListItem>> {
    const cacheKey = `category:${slug}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const response = await this.fetchData<ProductListItem>("products", {
      filters: {
        sub_category: {
          category: {
            slug: { $eq: slug },
          },
        },
      },
      populate: ["images", "variants"],
      fields: ["name", "slug", "price"],
      sort: ["variants.price:asc"],
      pagination: { pageSize: 100 },
    });

    cache.set(cacheKey, response);
    return response;
  }

  /**
   * Cached fetch of products by sub‑category slug
   */
  static async getProductsBySubCategory(
    slug: string
  ): Promise<StrapiResponse<ProductListItem>> {
    const cacheKey = `sub_category:${slug}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const response = await this.fetchData<ProductListItem>("products", {
      filters: { sub_category: { slug: { $eq: slug } } },
      populate: ["images", "variants"],
      fields: ["name", "slug", "price"],
      sort: ["variants.price:asc"],
      pagination: { pageSize: 100 },
    });

    cache.set(cacheKey, response);
    return response;
  }
}

/**
 * Example attribute types — adjust these imports to point at your actual definitions
 */
export interface TProductAttributes {
  name: string;
  slug: string;
  price: number;
  images: UploadedImage[];
  variants: ProductVariant[];
}

export interface CategoryWithProducts {
  name: string;
  slug: string;
  products: StrapiResponse<ProductListItem>;
}

export interface ProductListItem {
  name: string;
  slug: string;
  price: number;
}
