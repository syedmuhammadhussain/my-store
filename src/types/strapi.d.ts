// types/strapi.d.ts
export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Export all other interfaces as needed...
