'use client';

import Loading from '@/components/Loading';
import { useAuth } from '@/utils/context/authContext';
import { useToast } from '@/utils/context/toastContext';
import { getUserCategories, getUserLinks } from '@/utils/database';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Collections() {
  const { user, userLoading } = useAuth();
  const { showError } = useToast();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      if (user && !userLoading) {
        try {
          setIsLoading(true);
          const [userLinks, userCategories] = await Promise.all([getUserLinks(user.uid), getUserCategories(user.uid)]);

          // Group links by category
          const groupedCollections = userCategories.map((category) => ({
            ...category,
            links: userLinks.filter((link) => link.categoryId === category.id),
          }));

          setCollections(groupedCollections);
        } catch (error) {
          console.error('Error fetching collections:', error);
          showError('Failed to load collections. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCollections();
  }, [user, userLoading, showError]);

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return collection.name.toLowerCase().includes(query) || collection.description?.toLowerCase().includes(query) || collection.links.some((link) => link.title.toLowerCase().includes(query) || link.description.toLowerCase().includes(query) || link.url.toLowerCase().includes(query) || (link.tags && link.tags.some((tag) => tag.toLowerCase().includes(query))));
    }
    return true;
  });

  if (userLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-8 text-center">
          <Image src="/icons/lock.svg" alt="Login required" width={64} height={64} className="mx-auto mb-4" />
          <h2 className="h2-bold text-dark100_light900 mb-2">Login Required</h2>
          <p className="paragraph-regular text-dark300_light700 mb-4">Please login to view and manage your collections</p>
          <Link href="/auth" className="bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
            <Image src="/icons/log-in.svg" alt="Login" width={20} height={20} />
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* Collections Header */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user?.photoURL && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-col text-center md:text-left">
              <h1 className="h2-bold text-dark100_light900">My Collections</h1>
              <p className="paragraph-regular text-dark300_light700 mt-2">Organize and manage your curated resource collections</p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-4">
          <div className="relative">
            <Image src="/icons/search.svg" alt="Search" width={20} height={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark300_light700" />
            <input type="text" placeholder="Search in collections..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-light800_dark400 text-dark100_light900 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark300_light700 hover:text-dark100_light900">
                <Image src="/icons/x.svg" alt="Clear" width={16} height={16} />
              </button>
            )}
          </div>
        </section>

        {/* Collections Grid */}
        <section className="grid grid-cols-1 gap-6">
          {collections.length === 0 ? (
            <div className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-8 text-center">
              <Image src="/icons/empty.svg" alt="No collections" width={120} height={120} className="mx-auto opacity-50" />
              <h3 className="h3-bold text-dark100_light900 mt-4">No Collections Yet</h3>
              <p className="paragraph-regular text-dark300_light700 mt-2">Start organizing your resources by creating collections in your dashboard</p>
              <Link href="/user/dashboard" className="bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 mt-4">
                <Image src="/icons/plus.svg" alt="Create" width={20} height={20} />
                Create Collection
              </Link>
            </div>
          ) : (
            filteredCollections.map((collection) => (
              <div key={collection.id} className="background-light900_dark300 rounded-lg shadow-light100_dark100 p-6">
                <div className="flex-between mb-6">
                  <div>
                    <h2 className="h3-bold text-dark100_light900">{collection.name}</h2>
                    {collection.description && <p className="paragraph-regular text-dark300_light700 mt-1">{collection.description}</p>}
                  </div>
                  <Link href={`/user/dashboard?category=${collection.id}`} className="bg-primary-500/10 text-primary-500 paragraph-medium px-4 py-2 rounded-lg transition-colors hover:bg-primary-500/20">
                    Manage
                  </Link>
                </div>

                {collection.links.length === 0 ? (
                  <p className="text-center paragraph-regular text-dark300_light700 py-4">No links in this collection yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collection.links.map((link) => (
                      <div key={link.id} className="bg-light850_dark300 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="base-semibold text-dark100_light900 mb-2">{link.title}</h3>
                        <p className="body-regular text-dark300_light700 mb-3 line-clamp-2">{link.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {link.tags &&
                            link.tags.map((tag) => (
                              <span key={tag} className="bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
                          Visit Resource
                          <Image src="/icons/external-link.svg" alt="External Link" width={16} height={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
