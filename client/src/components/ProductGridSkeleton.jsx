import Skeleton from "./Skeleton";

const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow p-4 w-[320px]">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-4 w-2/3 mt-4 rounded-md" />

          <div className="space-y-2 mt-4">
            <Skeleton className="h-3 w-5/6 rounded" />
            <Skeleton className="h-3 w-4/6 rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-3 w-2/3 rounded" />
          </div>

          <div className="flex gap-2 mt-5">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;