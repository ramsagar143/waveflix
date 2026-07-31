"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Click-and-drag horizontal scrolling for a ref'd container, tuned so every
 * horizontal row in the app (home page sliders, the cast row, the seasons
 * row, etc.) feels exactly the same.
 *
 * Touch devices are left completely alone — they already get free, native,
 * hardware-accelerated scrolling and none of this code runs for them, since
 * it's only wired up through mouse events.
 *
 * What this fixes vs. a naive "onMouseDown -> set scrollLeft" implementation:
 *  - scrollLeft is written at most once per animation frame (via rAF) so
 *    the drag never stutters, even if the browser fires many mousemove
 *    events in a single frame.
 *  - the browser's default drag-to-select-text behavior is suppressed
 *    while dragging (user-select: none), so a left-click drag pans the
 *    row instead of highlighting the cards' text.
 *  - a real drag swallows the click that would otherwise fire on whatever
 *    card/link is under the cursor on mouse-up, so dragging never
 *    accidentally navigates.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const didDrag = useRef(false);
  const rafId = useRef<number | null>(null);
  const pendingLeft = useRef<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    const el = ref.current;
    if (!el) return;
    dragStartX.current = e.clientX;
    dragStartScroll.current = el.scrollLeft;
    didDrag.current = false;
    setGrabbing(true);
  };

  useEffect(() => {
    if (!grabbing) return;

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      if (Math.abs(delta) > 4) didDrag.current = true;
      if (didDrag.current) {
        e.preventDefault();
        pendingLeft.current = dragStartScroll.current - delta;
        if (rafId.current == null) {
          rafId.current = requestAnimationFrame(() => {
            const el = ref.current;
            if (el && pendingLeft.current != null) el.scrollLeft = pendingLeft.current;
            rafId.current = null;
          });
        }
      }
    };
    const onUp = () => setGrabbing(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [grabbing]);

  const onClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    didDrag.current = false;
  };

  return {
    ref,
    grabbing,
    dragHandlers: {
      onMouseDown,
      onClickCapture,
      onDragStart: (e: React.DragEvent) => e.preventDefault(),
    },
    dragStyle: {
      userSelect: (grabbing ? "none" : "auto") as React.CSSProperties["userSelect"],
      WebkitOverflowScrolling: "touch" as const,
    },
  };
}
