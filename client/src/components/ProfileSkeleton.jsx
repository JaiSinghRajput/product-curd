import Skeleton from "./Skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="bg-white rounded-3xl shadow p-6 md:p-8">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-8 w-56 mt-3 rounded-lg" />
        <Skeleton className="h-4 w-80 max-w-full mt-3 rounded" />

        <Skeleton className="h-11 w-full mt-8 rounded-xl" />

        <div className="rounded-2xl border border-dashed border-slate-200 p-4 mt-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-9 w-28 rounded-xl" />
                <Skeleton className="h-9 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <Skeleton className="h-12 w-full mt-6 rounded-xl" />
      </div>

      <aside className="rounded-3xl bg-linear-to-br from-slate-900 to-slate-700 p-6 md:p-8 shadow-lg">
        <Skeleton className="h-3 w-16 rounded bg-white/20" />
        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-2xl bg-white/20" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-36 rounded bg-white/20" />
            <Skeleton className="h-4 w-44 rounded bg-white/20" />
          </div>
        </div>
        <div className="space-y-3 mt-8">
          <Skeleton className="h-3 w-full rounded bg-white/20" />
          <Skeleton className="h-3 w-5/6 rounded bg-white/20" />
          <Skeleton className="h-3 w-4/5 rounded bg-white/20" />
        </div>
      </aside>
    </div>
  );
};

export default ProfileSkeleton;