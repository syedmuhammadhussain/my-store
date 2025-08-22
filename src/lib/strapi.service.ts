// src/lib/strapi.service.ts
import qs from "qs";
import { LRUCache } from "lru-cache";
import { UploadedImage } from "@/types/image";
import { ProductVariant } from "@/types/variant";
import { CategoryAttributes } from "@/types/category";
import { SubCategoryAttributes } from "@/types/sub_category";
import { ProductAttributes } from "@/types/product";
import { Reviews } from "@/types/review";

/**
 * Caches: Always store the full StrapiResponse<TItem>
 * where StrapiResponse<T> has `data: T[]`.
 */
const cache = new LRUCache<string, StrapiResponse<ProductListItem>>({
  max: 100,
  ttl: 1000 * 60 * 5,
});

// categories endpoint returns an array of CategoryAttributes
const categoryCache = new LRUCache<
  string,
  StrapiResponse<CategoryAttributes[]>
>({
  max: 50,
  ttl: 1000 * 60 * 5,
});

// sub-categories endpoint returns an array of SubCategoryAttributes
const subCategoryCache = new LRUCache<
  string,
  StrapiResponse<SubCategoryAttributes[]>
>({
  max: 50,
  ttl: 1000 * 60 * 5,
});

const allProductsCache = new LRUCache<string, AllProductsResponse>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// allCategoryAndSubCategory should store StrapiResponse<CategoryAttributes[]>
const allCategoryAndSubCategory = new LRUCache<
  string,
  StrapiResponse<CategoryAttributes[]>
>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// allFeaturedProducts should store StrapiResponse<ProductAttributes[]>
const allFeaturedProducts = new LRUCache<
  string,
  StrapiResponse<ProductAttributes[]>
>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

// cache published reviews by product id
const allPublishedReviewsByProductId = new LRUCache<
  string,
  StrapiResponse<Reviews[]>
>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
});

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

export interface StaticProduct {
  slug: string;
  product_colors: { variants: { sku: string }[] }[];
}

export type AllProductsResponse = StrapiResponse<StaticProduct>;

/**
 * Generic shape of Strapi's REST response
 */
export interface StrapiResponse<T> {
  data: T[]; // note: T is the *item* type; Strapi returns data: T[]
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

export interface ExtraOptions {
  encodeValuesOnly?: boolean;
  arrayFormat?: "indices" | "brackets" | "repeat" | "comma" | undefined;
}

export default class StrapiService {
  /**
   * Low-level fetch helper with typed return
   */
  private static async fetchData<T>(
    endpoint: string,
    queryOptions: StrapiQueryOptions = {},
    extraOptions: ExtraOptions = { encodeValuesOnly: true }
  ): Promise<StrapiResponse<T>> {
    const query = qs.stringify(queryOptions, extraOptions);
    const url = `${STRAPI_URL}/api/${endpoint}${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Strapi API request failed: ${response.status}`);
    }

    const json = (await response.json()) as StrapiResponse<T>;
    return json;
  }

  /**
   * Fetch all products with slug
   */
  static async getAllProductSlugs(): Promise<StrapiResponse<{ slug: string }>> {
    return this.fetchData<{ slug: string }>("products", {
      fields: ["slug"],
      pagination: { pageSize: 1000 },
    });
  }

  /**
   * Fetch all products with slug + variant SKUs
   */
  static async getAllProducts(): Promise<AllProductsResponse> {
    const cacheKey = "all_products";
    if (allProductsCache.has(cacheKey)) {
      return allProductsCache.get(cacheKey)!;
    }

    const response = await this.fetchData<StaticProduct>("products", {
      fields: ["slug"],
      populate: {
        product_colors: {
          populate: {
            variants: { fields: ["sku", "documentId", "id"] },
          },
        },
      },
      pagination: { pageSize: 1000 },
    });

    allProductsCache.set(cacheKey, response);
    return response;
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
        product_colors: {
          populate: {
            variants: {
              populate: {
                size: true,
                inventory: {
                  fields: ["quantity", "inventory_status"],
                },
              },
            },
            color: true,
            images: true,
            swatch_image: true,
          },
        },
        size_group: {
          populate: { sizes: true },
        },
        sub_category: true,
        discount: true,
        reviews: true,
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
    const cacheKey = `product_category:${slug}`;
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
      populate: ["images", "gallery"],
      fields: ["name", "slug", "price", "discount_price"],
      sort: ["product_colors.variants.price:asc"],
      pagination: { pageSize: 100 },
    });

    cache.set(cacheKey, response);
    return response;
  }

  /**
   * Cached fetch of products by sub-category slug
   */
  static async getProductsBySubCategory(
    slug: string
  ): Promise<StrapiResponse<ProductListItem>> {
    const cacheKey = `product_sub_category:${slug}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    const response = await this.fetchData<ProductListItem>("products", {
      filters: { sub_category: { slug: { $eq: slug } } },
      populate: ["images", "gallery"],
      fields: ["name", "slug", "price"],
      sort: ["product_colors.variants.price:asc"],
      pagination: { pageSize: 100 },
    });

    cache.set(cacheKey, response);
    return response;
  }

  // ** Fetch Categories (returns array)
  static async getCategories(): Promise<StrapiResponse<CategoryAttributes[]>> {
    const cacheKey = `product_category:all`;
    if (categoryCache.has(cacheKey)) {
      return categoryCache.get(cacheKey)!;
    }

    const response = await this.fetchData<CategoryAttributes[]>(
      "categories?sort=name:desc"
    );

    categoryCache.set(cacheKey, response);
    return response;
  }

  // ** Fetch Selected Sub Categories (returns array)
  static async getSubCategoryBySlug(
    slug: string
  ): Promise<StrapiResponse<SubCategoryAttributes[]>> {
    const cacheKey = `sub_category_slug:${slug}`;
    if (subCategoryCache.has(cacheKey)) {
      return subCategoryCache.get(cacheKey)!;
    }

    const response = await this.fetchData<SubCategoryAttributes[]>(
      "sub-categories",
      {
        sort: ["name:desc"],
        filters: { slug: { $eq: slug } },
        populate: { category: { fields: ["slug"] } },
        fields: ["name", "slug"],
      }
    );

    subCategoryCache.set(cacheKey, response);
    return response;
  }

  // ** Fetch Selected Sub Categories by Category Slug (returns array)
  static async getSubCategoriesByCategorySlug(
    slug: string
  ): Promise<StrapiResponse<SubCategoryAttributes[]>> {
    const cacheKey = `sub_category_by_category_slug:${slug}`;
    if (subCategoryCache.has(cacheKey)) {
      return subCategoryCache.get(cacheKey)!;
    }

    const response = await this.fetchData<SubCategoryAttributes[]>(
      "sub-categories",
      {
        sort: ["name:asc"],
        filters: {
          category: {
            slug: { $eq: slug },
          },
        },
        populate: { category: true },
      }
    );

    subCategoryCache.set(cacheKey, response);
    return response;
  }

  /**
   * Fetch categories and their sub-categories (cached).
   * Mirrors the Postman request: sort by name asc, include sub_categories name+slug, and only name+slug fields for categories.
   */
  static async getCategoriesWithSubs(): Promise<
    StrapiResponse<CategoryAttributes[]>
  > {
    const cacheKey = `categories-with-subs:all`;
    if (allCategoryAndSubCategory.has(cacheKey)) {
      return allCategoryAndSubCategory.get(cacheKey)!;
    }

    const queryOptions = {
      sort: ["name:desc"],
      populate: {
        sub_categories: { sort: ["name:asc"], fields: ["id", "name", "slug"] },
      },
      fields: ["id", "name", "slug"],
    };

    // use arrayFormat indices so qs produces populate[0]=... style expected by Strapi
    const response = await this.fetchData<CategoryAttributes[]>(
      "categories",
      queryOptions,
      { encodeValuesOnly: true, arrayFormat: "indices" }
    );

    allCategoryAndSubCategory.set(cacheKey, response);
    return response;
  }

  static async getFeaturedProducts(): Promise<
    StrapiResponse<ProductAttributes[]>
  > {
    const cacheKey = `featured_products`;
    if (allFeaturedProducts.has(cacheKey)) {
      return allFeaturedProducts.get(cacheKey)!;
    }

    /**
     * Fetch featured product and (cache)
     */
    const response = await this.fetchData<ProductAttributes[]>(
      "products",
      {
        filters: { is_feature: { $eq: true } },
        populate: ["images", "gallery"],
        fields: ["name", "slug", "price", "discount_price"],
        sort: ["createdAt:desc"],
        pagination: { pageSize: 12 },
      },
      { encodeValuesOnly: true }
    );

    allFeaturedProducts.set(cacheKey, response);
    return response;
  }

  static async getPublishedReviewsByProductId(
    productId: number
  ): Promise<StrapiResponse<Reviews[]>> {
    const cacheKey = `reviews:${productId}`;
    if (allPublishedReviewsByProductId.has(cacheKey)) {
      return allPublishedReviewsByProductId.get(cacheKey)!;
    }

    /**
     * Fetch published reviews by product id (cache)
     */
    const response = await this.fetchData<Reviews[]>(
      "reviews",
      {
        sort: ["createdAt:desc"],
        filters: {
          product: { id: { $eq: productId } },
          review_status: { $eq: "Published" },
        },
        populate: { users_permissions_user: true },
        pagination: { pageSize: 10, page: 1 },
      },
      { encodeValuesOnly: true }
    );

    allPublishedReviewsByProductId.set(cacheKey, response);
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
