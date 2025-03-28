const MessageSkeleton = () => {
  const skeletonCount = Array(6).fill(null);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {skeletonCount.map((_, index) => (
        <div key={index} className={`chat ${index % 2 === 0 ? 'chat-start' : 'chat-end'}`}>
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skelton h-full w-full rounded-full" />
            </div>
          </div>

          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-24" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-64" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
