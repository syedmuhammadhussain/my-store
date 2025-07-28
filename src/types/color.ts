import { UploadedImage } from "./image";

export interface ColorVariant {
  id: number;
  name: string;
  slig: string;
  hex_code: string;
  swatch_image: UploadedImage[];
}
