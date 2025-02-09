import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import { Glasses } from 'lucide-react';

const Navbar = () => {
  const { login, logout, authenticated, user } = usePrivy();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showWalletMenu, setShowWalletMenu] = React.useState(false);
  const location = useLocation();
  const walletMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setShowWalletMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClasses = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground/80 hover:text-primary'
    }`;

  const handleDisconnect = async () => {
    try {
      await logout();
      setShowWalletMenu(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const WalletButton = () => {
    if (authenticated) {
      return (
        <div className="relative" ref={walletMenuRef}>
          <button
            onClick={() => setShowWalletMenu(!showWalletMenu)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
          </button>
          {showWalletMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5"
            >
              <div className="py-1">
                <button
                  onClick={handleDisconnect}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-secondary/80"
                >
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={login}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
      >
        Connect Wallet
      </motion.button>
    );
  };

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Glasses className="h-8 w-8 text-primary" />
              <span className="text-xl font-serif font-bold">Alfred.ai</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className={navLinkClasses('/')}>
                Home
              </Link>
              <Link to="/portfolio" className={navLinkClasses('/portfolio')}>
                Portfolio
              </Link>
              <WalletButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
            >
              <Glasses className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block ${navLinkClasses('/')}`}
            >
              Home
            </Link>
            <Link
              to="/portfolio"
              className={`block ${navLinkClasses('/portfolio')}`}
            >
              Portfolio
            </Link>
            <div className="mt-4">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;