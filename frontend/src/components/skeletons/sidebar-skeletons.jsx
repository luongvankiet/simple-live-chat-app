import { User } from 'lucide-react';

const SidebarSkeletons = () => {
  const skeletonCount = Array(8).fill(null);

  return (
    <aside className="border-base-300 flex h-full w-20 flex-col border-r transition-all duration-200 lg:w-72">
      <div className="borderbase-300 w-full border-b p-5">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>
      </div>

      <div className="w-full overflow-y-auto py-3">
        {skeletonCount.map((_, index) => (
          <div key={index} className="flex w-full items-center gap-3 p-3">
            <div className="relative mx-auto lg:mx-0">
              {/* Avatar Skeleton */}
              <div className="relative mx-auto lg:mx-0">
                <div className="skeleton size-12 rounded-full" />
              </div>
            </div>

            {/* User Info Skeleton - only visible on large screens */}
            <div className="hidden min-w-0 flex-1 text-left lg:block">
              <div className="skeleton mb-2 h-4 w-48" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeletons;
