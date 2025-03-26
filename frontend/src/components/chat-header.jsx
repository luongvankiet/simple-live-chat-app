import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { X } from 'lucide-react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <div className="border-base-300 border-b p-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="relative size-10 rounded-full">
              <img src={selectedUser?.profileImage || '/images/profile-picture.webp'} alt={selectedUser?.fullName} />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-base-content/70 text-sm">{onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}</p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
