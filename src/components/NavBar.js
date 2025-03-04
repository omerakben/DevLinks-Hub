/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="background-light900_dark200 shadow-light100_dark100 fixed z-50 w-full">
      <div className="flex-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex-start">
          <Link href="/" className="flex-center gap-2">
            <div className="flex items-center gap-1">
              <Image src="/icons/link.svg" alt="Link icon" width={24} height={24} className="text-primary-500" />
              <h1 className="h3-bold text-dark100_light900 primary-text-gradient">DevLinks</h1>
              <p className="h3-bold text-dark100_light900">Hub</p>
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
            <button type="button" onClick={signOut} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-4 py-2 rounded-lg transition-colors">
              <Image src="/icons/log-out.svg" alt="Sign out icon" width={20} height={20} />
              Sign Out
            </button>
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
            <button type="button" onClick={signOut} className="flex items-center gap-2 w-full text-left bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-3 py-2 rounded-lg transition-colors">
              <Image src="/icons/log-out.svg" alt="Sign out icon" width={20} height={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
