export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PostStatus = "draft" | "published";
export type ContentLocale = "en" | "es";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      about_profile: {
        Row: {
          id: boolean;
          image_path: string | null;
          image_url: string;
          title_es: string;
          title_en: string;
          intro_es: string;
          intro_en: string;
          body_es: string;
          body_en: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          image_path?: string | null;
          image_url?: string;
          title_es?: string;
          title_en?: string;
          intro_es?: string;
          intro_en?: string;
          body_es?: string;
          body_en?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          image_path?: string | null;
          image_url?: string;
          title_es?: string;
          title_en?: string;
          intro_es?: string;
          intro_en?: string;
          body_es?: string;
          body_en?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          status: PostStatus;
          published_at: string | null;
          cover_image_url: string | null;
          cover_image_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          status?: PostStatus;
          published_at?: string | null;
          cover_image_url?: string | null;
          cover_image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          status?: PostStatus;
          published_at?: string | null;
          cover_image_url?: string | null;
          cover_image_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      post_translations: {
        Row: {
          post_id: string;
          locale: ContentLocale;
          title: string;
          description: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          post_id: string;
          locale: ContentLocale;
          title: string;
          description?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          post_id?: string;
          locale?: ContentLocale;
          title?: string;
          description?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      photos: {
        Row: {
          id: string;
          image_path: string;
          image_url: string;
          alt_es: string | null;
          alt_en: string | null;
          caption_es: string | null;
          caption_en: string | null;
          visible: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_path: string;
          image_url: string;
          alt_es?: string | null;
          alt_en?: string | null;
          caption_es?: string | null;
          caption_en?: string | null;
          visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_path?: string;
          image_url?: string;
          alt_es?: string | null;
          alt_en?: string | null;
          caption_es?: string | null;
          caption_en?: string | null;
          visible?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
