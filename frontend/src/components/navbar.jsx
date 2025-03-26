import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { paths } from '@/paths';
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
  const { setSelectedUser } = useChat();
  const { logout, authUser } = useAuth();

  const handleLogout = () => {
    logout();
    setSelectedUser(null);
  };

  return (
    <header className="bg-base-100/80 border-base-300 fixed top-0 z-50 w-full border-b backdrop-blur-lg">
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 transition-all hover:opacity-80">
              <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                <MessageSquare className="text-primary h-5 w-5" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to={paths.settings} className="btn btn-sm gap-2 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={paths.profile} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex items-center gap-2" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
