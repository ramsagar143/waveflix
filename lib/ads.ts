"use client";

export const SMARTLINK = 'https://interventioncopiedloitering.com/g03g5niay?key=52ba61e02cb2350e4750869bcde8f6bb';

export function openSmartlink() {
  if (typeof window !== 'undefined') {
    window.open(SMARTLINK, '_blank', 'noopener');
  }
}
