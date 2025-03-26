import { useTheme } from '@/hooks/useTheme';
import { THEMES } from '@/utils/themes';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useState } from 'react';

const PREVIEW_MESSAGES = [
  { isSent: true, content: 'Hello, how are you?' },
  { isSent: false, content: 'I am fine, thanks!' },
  { isSent: true, content: 'What about you?' },
  { isSent: false, content: 'I am also fine.' },
  { isSent: true, content: 'Cool!' },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const [showMore, setShowMore] = useState(false);

  return (
    <div className="container mx-auto h-screen max-w-5xl px-4 pt-20">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-base-content/70 text-sm"> Choose your preferred theme</p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {THEMES.slice(0, showMore ? THEMES.length : 16).map((t) => (
            <button
              key={t}
              className={`group flex cursor-pointer flex-col items-center gap-2 rounded-lg p-2 transition-colors ${theme === t ? 'bg-base-300' : 'hover:bg-base-300/100'}`}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full overflow-hidden rounded-md" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="bg-primary rounded"></div>
                  <div className="bg-secondary rounded"></div>
                  <div className="bg-accent rounded"></div>
                  <div className="bg-neutral rounded"></div>
                </div>
              </div>
              <div className="w-full truncate text-center text-[11px] font-medium">{t.charAt(0).toUpperCase() + t.slice(1)}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          {THEMES.length > 16 && (
            <button className="btn btn-base-100" onClick={() => setShowMore(!showMore)}>
              <div className="text-md flex items-center gap-2">
                {showMore ? (
                  <>
                    Show less <ChevronUp />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown />
                  </>
                )}
              </div>
            </button>
          )}
        </div>

        {/* Preview chatbox */}
        <h3 className="mb-3 text-lg font-semibold">Preview</h3>
        <div className="border-base-300 bg-base-100 overflow-hidden rounded-xl border shadow-lg">
          <div className="bg-base-200 p-4">
            <div className="mx-auto max-w-lg">
              {/* Mock Chat UI */}
              <div className="bg-base-100 overflow-hidden rounded-xl shadow-sm">
                {/* Chat Header */}
                <div className="border-base-300 bg-base-100 border-b px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-content flex h-8 w-8 items-center justify-center rounded-full font-medium">J</div>
                    <div>
                      <h3 className="text-sm font-medium">John Doe</h3>
                      <p className="text-base-content/70 text-xs">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-base-100 max-h-[300px] min-h-[300px] space-y-4 overflow-y-auto p-4">
                  {PREVIEW_MESSAGES.map((message, i) => (
                    <div key={i} className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${message.isSent ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`mt-1.5 text-[10px] ${message.isSent ? 'text-primary-content/70' : 'text-base-content/70'}`}>12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-base-300 bg-base-300 border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered h-10 flex-1 text-sm"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
              />
              <button className="btn btn-primary h-10 min-h-10">
                <Send size={10} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
