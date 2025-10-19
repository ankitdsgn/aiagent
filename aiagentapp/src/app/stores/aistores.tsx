"use client";
import { create } from "zustand";

export type Variation = {
  variation: string;
  temp: number;
  top_p: number;
};

type AIState = {
  working: boolean;
  temperature: number;
  topP: number;
  variations: Variation[];
  setVariations: (v: Variation[]) => void;
  clearVariations: () => void;
};

export const useAIStore = create<AIState>((set) => ({
  working: false,
  temperature: 0.7,
  topP: 0.9,
  variations: [],
  setVariations: (v) => set({ variations: v }),
  clearVariations: () => set({ variations: [] }),
}));
