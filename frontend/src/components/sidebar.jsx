import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import SidebarSkeletons from './skeletons/sidebar-skeletons';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, readAllMessages } = useChat();

  const { onlineUsers } = useAuth();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await readAllMessages(user._id);
  };

  const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeletons />;
  }

  return (
    <aside className="border-base-300 flex h-full w-25 flex-col border-r transition-all duration-200 lg:w-72">
      <div className="border-base-300 w-full border-b p-5">
        <div className="flex items-center justify-center gap-2 px-2 lg:justify-start">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden items-center gap-2 lg:flex">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm" />
            <span className="text-sm"> Show online only</span>
          </label>
          <span className="text-xs text-zinc-500"> ({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="w-full overflow-y-auto px-2 py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`hover:bg-base-300 flex w-full items-center gap-3 p-2 transition-colors ${selectedUser?._id === user._id && 'bg-base-300 ring-base-300 ring-1'}`}
          >
            <div className="flex w-full items-center gap-3">
              <div className="relative mx-auto lg:mx-0">
                <img src={user.profileImage || '/images/profile-picture.webp'} alt={user.name} className="size-12 rounded-full object-cover" />

                {user.unreadMessages > 0 && (
                  <div className="badge badge-xs badge-info absolute top-0 -right-2 block lg:hidden">
                    {user.unreadMessages > 100 ? '99+' : user.unreadMessages}
                  </div>
                )}

                {onlineUsers.includes(user._id) && (
                  <span className="absolute right-0 bottom-0 size-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User Info - only visible on large screens */}

              <div className="hidden min-w-0 text-left lg:block">
                <div className="truncate font-medium">{user.fullName}</div>
                <div className="text-sm text-zinc-400">{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</div>
              </div>
            </div>

            {user.unreadMessages > 0 && (
              <div className="hidden lg:block">
                <div className="badge badge-sm badge-info">{user.unreadMessages > 100 ? '99+' : user.unreadMessages}</div>
              </div>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
