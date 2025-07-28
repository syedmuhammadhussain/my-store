// types/strapi/common.ts
export interface StrapiMetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination?: StrapiMetaPagination;
}

export interface StrapiResponseData<T> {
  id: number;
  documentId: string;
  attributes: T;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiResponse<T> {
  data: StrapiResponseData<T> | StrapiResponseData<T>[];
  meta?: StrapiMeta;
}
