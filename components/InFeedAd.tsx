import AdUnit from "./AdUnit";

const AD = { key: "9e69490f7ae5470591e45e2f286b9264", width: 300, height: 250 };

// Mobile/tablet: a single centered 300x250 unit.
// Desktop (lg+): 4 units in one row, still centered as a group.
// Pure CSS show/hide (no JS) so there's no hydration flicker, and the row
// scrolls horizontally as a safety net if a narrower desktop can't fit all 4.
export default function InFeedAd({
  className = "",
  padded = true,
}: {
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`w-full flex justify-center my-4 md:my-6 ${padded ? "px-4 md:px-8" : ""} ${className}`}
    >
      <div className="max-w-full rounded-[18px] overflow-hidden bg-white/[0.03] border border-white/10">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 px-2.5 pt-2 pb-1 text-center">
          Advertisement
        </p>
        <div className="flex items-center justify-center gap-3 px-1.5 pb-1.5 overflow-x-auto">
          <AdUnit adKey={AD.key} width={AD.width} height={AD.height} />
          <div className="hidden lg:block">
            <AdUnit adKey={AD.key} width={AD.width} height={AD.height} />
          </div>
          <div className="hidden lg:block">
            <AdUnit adKey={AD.key} width={AD.width} height={AD.height} />
          </div>
          <div className="hidden lg:block">
            <AdUnit adKey={AD.key} width={AD.width} height={AD.height} />
          </div>
        </div>
      </div>
    </div>
  );
}
