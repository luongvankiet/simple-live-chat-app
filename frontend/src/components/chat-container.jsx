import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { formatDate } from '@/utils/utils';
import { CheckCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import ChatHeader from './chat-header';
import MessageInput from './message-input';
import MessageSkeleton from './skeletons/message-skeleton';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChat();

  const { authUser } = useAuth();

  const myMessage = useRef(null);

  const scrollToBottom = () => {
    if (myMessage && myMessage.current) {
      myMessage.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [getMessages, selectedUser._id, subscribeToMessages, unsubscribeFromMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message._id} ref={myMessage}>
            <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser?._id
                        ? message.sender?.profileImage || '/images/profile-picture.webp'
                        : message.receiver?.profileImage || '/images/profile-picture.webp'
                    }
                    alt="Profile Pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1 flex flex-1">
                {message.senderId === authUser?._id && (
                  <div className={`ml-1 flex items-center text-xs opacity-50 ${message.readAt && 'text-info'}`}>
                    {message.readAt ? (
                      <>
                        <CheckCheck className="mr-1 size-4" /> Seen
                      </>
                    ) : (
                      'Delivered'
                    )}
                  </div>
                )}

                <time className="ml-1 text-xs opacity-50">{formatDate(message.createdAt)}</time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && <img src={message.image} alt="Attached Image" className="mb-2 rounded-md sm:max-w-[200px]" />}

                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
