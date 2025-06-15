// src/types/strapi.ts

export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Software {
  id: number;
  attributes: {
    name: string;
    slug: string;
    short_description?: string;
    description?: string;
    website_url?: string;
    pricing_model?: 'Free' | 'Freemium' | 'Paid' | 'Enterprise';
    starting_price?: number;
    rating?: number;
    featured?: boolean;
    status?: 'Draft' | 'Published' | 'Archived';
    createdAt: string;
    updatedAt: string;
    logo?: {
      data: StrapiImage;
    };
    screenshots?: {
      data: StrapiImage[];
    };
    category?: {
      data: Category;
    };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}