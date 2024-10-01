// src/types.ts

export interface Music {
    id: string;
    filePath: string;
    musicName: string;
    isPlayed: boolean;
  }
  
  export interface Ticker {
    id: string;
    description: string;
    type: number;
    isPublished: boolean;
  }
  
  export interface Document {
    id: string;
    displayName: string;
    order: number;
    isPlayed: boolean;
    startTime: number;
    displayTime: number;
    recurent: number;
    startAnimation: number;
    endAnimation: number;
    type: number;
    medias: {
      name: string;
      filePath: string;
    }[];
  }
  
  export interface TV {
    id: string;
    name: string;
    order: number;
    isActive: boolean;
    music: Music;
    ticker: Ticker;
    documents: Document[];
    displayedImage: string;
  }
  export interface ApiResponse {
    success: boolean;
    message: string;
    resultData: TV | null;
    error?: string;
  }