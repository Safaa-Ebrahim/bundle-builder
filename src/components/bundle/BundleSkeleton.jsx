import Skeleton from '../shared/Skeleton'

export default function BundleSkeleton() {
  return (
    <div className="min-h-svh py-8 px-4 xl:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-bg p-4 flex flex-col gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-56" />
            </div>
          ))}
        </div>

        <div className="rounded-[10px] bg-brand-bg p-5 xl:p-10 flex flex-col gap-4">
          <Skeleton className="h-6 w-48 bg-white" />
          <Skeleton className="h-4 w-full bg-white" />
          <div className="flex flex-col gap-3 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-white" />
            ))}
          </div>
          <Skeleton className="h-12 w-full mt-4 bg-white" />
        </div>
      </div>
    </div>
  )
}
