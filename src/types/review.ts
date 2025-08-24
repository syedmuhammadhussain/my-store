import { UploadedImage } from "./image";
import { UsersPermission } from "./users";

/**
 * Inventory status enumeration
 */
export type ReviewStatus = "Draft" | "Pending" | "Published";

/**
 * Base inventory interface
 */
export interface Reviews {
  id: number;
  documentId: string;
  title: string;
  comment: string;
  rating: number;
  review_status?: ReviewStatus;
  updatedAt: Date | string;
  createdAt: Date | string;
  publishedAt: Date | string;
  username: string | null;
  email: string | null;
  upload_media: UploadedImage[];
  users_permissions_user: UsersPermission | null;
  authorName?: string;
  verified?: string;
}
