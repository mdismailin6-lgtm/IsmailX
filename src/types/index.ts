import { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  slug: string;
  name: string;
  categoryIds: string[];
  contentType: string;
  shortDescription: string;
  fullDescription: string;
  purpose: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  gallery: string[];
  videoUrl: string;
  technologies: string[];
  features: string[];
  tags: string[];
  status: string;
  isFeatured: boolean;
  isVisible: boolean;
  links?: { liveDemoUrl?: string; sourceCodeUrl?: string; externalUrl?: string };
  contact?: { name?: string; email?: string; phone?: string; url?: string };
  visibility: Record<string, boolean>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  coverImageUrl: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Profile {
  id: string;
  name: string;
  brandName: string;
  profileImageUrl: string;
  professionalTitle: string;
  tagline: string;
  shortBio: string;
}
