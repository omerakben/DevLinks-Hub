/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn, signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Add event listener for signin buttons
  useEffect(() => {
    const handleSignInClick = () => {
      signIn();
    };

    // Add click event to all signin buttons
    const signinButtons = document.querySelectorAll('.signin-button');
    signinButtons.forEach((button) => {
      button.addEventListener('click', handleSignInClick);
    });

    return () => {
      signinButtons.forEach((button) => {
        button.removeEventListener('click', handleSignInClick);
      });
    };
  }, []);

  return (
    <nav className="background-light900_dark200 shadow-light100_dark100 fixed z-50 w-full">
      <div className="flex-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex-start">
          <Link href="/" className="flex-center gap-2">
            <div className="relative h-10 w-40">
              <Image src={isDarkMode ? '/images/logo-dark.svg' : '/images/logo-light.svg'} alt="DevLinks Hub Logo" fill className="object-contain" priority />
            </div>
          </Link>
        </div>

        <div className="hidden md:flex">
          <div className="flex-center gap-4">
            <Link href="/" className="text-dark300_light700 paragraph-medium hover:text-primary-500 transition-colors">
              <div className="flex items-center gap-2">
                <Image src="/icons/home.svg" alt="Home icon" width={20} height={20} />
                Home
              </div>
            </Link>

            {user ? (
              <>
                <Link href="/user/dashboard" className="text-dark300_light700 paragraph-medium hover:text-primary-500 transition-colors">
                  <div className="flex items-center gap-2">
                    <Image src="/icons/user.svg" alt="Dashboard icon" width={20} height={20} />
                    My Links
                  </div>
                </Link>

                {isAdmin && (
                  <Link href="/admin/dashboard" className="text-dark300_light700 paragraph-medium hover:text-primary-500 transition-colors">
                    <div className="flex items-center gap-2">
                      <Image src="/icons/settings.svg" alt="Admin icon" width={20} height={20} />
                      Admin
                    </div>
                  </Link>
                )}

                <button type="button" onClick={signOut} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
                  <Image src="/icons/log-out.svg" alt="Sign out icon" width={20} height={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <button type="button" className="signin-button flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
                <Image src="/icons/google.svg" alt="Google icon" width={20} height={20} />
                Sign In
              </button>
            )}
          </div>
        </div>

        <div className="md:hidden flex">
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex-center p-2 rounded-md text-dark400_light700 hover:text-primary-500 hover:bg-light-800 dark:hover:bg-dark-300 transition-colors">
            <span className="sr-only">Open main menu</span>
            {!isOpen ? <Image src="/icons/hamburger.svg" alt="Menu icon" width={24} height={24} /> : <Image src="/icons/close.svg" alt="Close icon" width={24} height={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden background-light900_dark200 shadow-light100_dark100">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link href="/" className="flex items-center gap-2 text-dark300_light700 paragraph-medium hover:text-primary-500 block px-3 py-2 rounded-lg transition-colors">
              <Image src="/icons/home.svg" alt="Home icon" width={20} height={20} />
              Home
            </Link>

            {user ? (
              <>
                <Link href="/user/dashboard" className="flex items-center gap-2 text-dark300_light700 paragraph-medium hover:text-primary-500 block px-3 py-2 rounded-lg transition-colors">
                  <Image src="/icons/user.svg" alt="Dashboard icon" width={20} height={20} />
                  My Links
                </Link>

                {isAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 text-dark300_light700 paragraph-medium hover:text-primary-500 block px-3 py-2 rounded-lg transition-colors">
                    <Image src="/icons/settings.svg" alt="Admin icon" width={20} height={20} />
                    Admin
                  </Link>
                )}

                <button type="button" onClick={signOut} className="flex items-center gap-2 w-full text-left bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-3 py-2 rounded-lg transition-colors">
                  <Image src="/icons/log-out.svg" alt="Sign out icon" width={20} height={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <button type="button" className="signin-button flex items-center gap-2 w-full text-left bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-3 py-2 rounded-lg transition-colors">
                <Image src="/icons/google.svg" alt="Google icon" width={20} height={20} />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
