import { useChat } from '@/hooks/useChat';
import { Image, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage } = useChat();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({ text, image: imagePreview });
      setText('');
      removeImage();
    } catch (error) {
      console.error('Error in sending message:', error);
    }
  };

  return (
    <div className="w-full p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 rounded-lg border border-zinc-700 object-cover" />
            <button onClick={removeImage} className="bg-base-300 absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="input input-bordered input-sm sm:input-md w-full rounded-lg"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

          <button
            type="button"
            className={`btn btn-circle hidden sm:flex ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => fileInputRef.current.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button type="submit" className="btn btn-circle btn-sm p-1" disabled={!text.trim() && !imagePreview}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
