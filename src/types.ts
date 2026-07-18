/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: "image" | "video";
  url: string; // URL de la imagen o video (o datos base64 para archivos subidos localmente)
  category: string; // Ej: "Videos carrusel", "Fotos carrusel", "Proyecto A", "Proyecto B"
  layout: "carousel" | "gallery"; // Cómo debe representarse en la interfaz
  createdAt: string;
}

export interface SanityConfig {
  projectId: string;
  dataset: string;
  token: string;
  useRealSanity: boolean;
}
