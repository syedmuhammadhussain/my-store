/** Describes a single “format” rendition of an uploaded image */
export interface ImageFormat {
  ext: string; // e.g. ".webp"
  url: string; // e.g. "/uploads/thumbnail_… .webp"
  hash: string; // internal hash name
  mime: string; // MIME type
  name: string; // original file name
  path: string | null; // usually null unless you’ve customized storage
  size: number; // file size in KB (e.g. 8.63)
  width: number; // pixel width
  height: number; // pixel height
  sizeInBytes: number; // file size in bytes (e.g. 8626)
}

/** The set of all available formats for this image */
export interface ImageFormats {
  small?: ImageFormat;
  thumbnail?: ImageFormat;
  medium?: ImageFormat;
  large?: ImageFormat;
  /** original is whatever you upload, often under key “original” */
  original?: ImageFormat;
  /** add any custom keys your Strapi config may generate */
  [key: string]: ImageFormat | undefined;
}

/** The top‑level object Strapi returns for a single uploaded file */
export interface UploadedImage {
  id: number;
  documentId: string;
  formats: ImageFormats;
}
