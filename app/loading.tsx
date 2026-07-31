export default function Loading() {
  return (
    <div className="px-4 md:px-8 pt-10">
      <div className="skeleton w-1/3 h-10 rounded-xl mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[2/3] rounded-[18px]" />
        ))}
      </div>
    </div>
  );
}
