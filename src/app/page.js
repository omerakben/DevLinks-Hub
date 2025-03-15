'use client';

import Loading from '@/components/Loading';
import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';
import { getPublicCategories, getPublicLinks } from '@/utils/database';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Home() {
  const { user, userLoading } = useAuth();
  const [publicLinks, setPublicLinks] = useState([]);
  const [publicCategories, setPublicCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(true);

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

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Add sample data if in development
        if (process.env.NODE_ENV === 'development') {
          // Sample data for development
          const sampleLinks = [
            {
              id: 'sample1',
              title: 'React Documentation',
              description: 'Official React documentation with guides, API reference, and examples.',
              url: 'https://reactjs.org',
              categoryId: 'cat1',
              tags: ['react', 'javascript', 'frontend'],
            },
            {
              id: 'sample2',
              title: 'Next.js Documentation',
              description: 'Learn about Next.js features and API.',
              url: 'https://nextjs.org/docs',
              categoryId: 'cat1',
              tags: ['nextjs', 'react', 'javascript'],
            },
            {
              id: 'sample3',
              title: 'Tailwind CSS',
              description: 'A utility-first CSS framework for rapidly building custom designs.',
              url: 'https://tailwindcss.com',
              categoryId: 'cat2',
              tags: ['css', 'tailwind', 'frontend'],
            },
            {
              id: 'sample4',
              title: 'TypeScript Handbook',
              description: 'The TypeScript Handbook is a comprehensive guide to the TypeScript language.',
              url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
              categoryId: 'cat3',
              tags: ['typescript', 'javascript', 'programming'],
            },
            {
              id: 'sample5',
              title: 'GitHub Documentation',
              description: 'Learn how to use GitHub for version control and collaboration.',
              url: 'https://docs.github.com',
              categoryId: 'cat4',
              tags: ['git', 'github', 'version control'],
            },
            {
              id: 'sample6',
              title: 'MDN Web Docs',
              description: 'Resources for developers, by developers.',
              url: 'https://developer.mozilla.org',
              categoryId: 'cat5',
              tags: ['web', 'html', 'css', 'javascript'],
            },
          ];

          const sampleCategories = [
            {
              id: 'cat1',
              name: 'Frameworks',
              description: 'JavaScript frameworks and libraries',
            },
            {
              id: 'cat2',
              name: 'CSS',
              description: 'CSS frameworks and tools',
            },
            {
              id: 'cat3',
              name: 'Languages',
              description: 'Programming languages',
            },
            {
              id: 'cat4',
              name: 'Tools',
              description: 'Development tools',
            },
            {
              id: 'cat5',
              name: 'Documentation',
              description: 'Reference documentation',
            },
          ];

          // Try to fetch real data, but use sample data if it fails
          try {
            const [links, categories] = await Promise.all([getPublicLinks(), getPublicCategories()]);

            // If we have real data, use it
            if (links.length > 0) {
              setPublicLinks(links);
            } else {
              console.log('No real links found, using sample data');
              setPublicLinks(sampleLinks);
            }

            if (categories.length > 0) {
              setPublicCategories(categories);
            } else {
              console.log('No real categories found, using sample data');
              setPublicCategories(sampleCategories);
            }
          } catch (fetchErr) {
            console.error('Error fetching real data:', fetchErr);
            setPublicLinks(sampleLinks);
            setPublicCategories(sampleCategories);
          }
        } else {
          // Production mode - only use real data
          const [links, categories] = await Promise.all([getPublicLinks(), getPublicCategories()]);
          setPublicLinks(links);
          setPublicCategories(categories);
        }
      } catch (err) {
        console.error('Error fetching public data:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  // Filter links based on selected category and search query
  const filteredLinks = publicLinks.filter((link) => {
    // Filter by category if selected
    if (selectedCategory && link.categoryId !== selectedCategory) {
      return false;
    }

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return link.title.toLowerCase().includes(query) || link.description.toLowerCase().includes(query) || link.url.toLowerCase().includes(query) || (link.tags && link.tags.some((tag) => tag.toLowerCase().includes(query)));
    }

    return true;
  });

  // Sort links based on active filter
  const sortedLinks = [...filteredLinks].sort(
    (a, b) =>
      // Sort by newest (created date) by default
      (b.createdAt || 0) - (a.createdAt || 0),
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Only show loading spinner for initial page load
  if (userLoading && isLoading) {
    return <Loading />;
  }

  // Helper function to render the appropriate message for empty results
  const getEmptyResultsMessage = () => {
    if (publicLinks.length === 0) {
      return 'No resources available yet';
    }
    if (searchQuery) {
      return 'No resources match your search';
    }
    return 'No resources available in this category';
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex-center py-10">
      <Loading />
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-8 text-center">
      <Image src={isDarkMode ? '/images/dark-error.png' : '/images/light-error.png'} alt="No resources found" width={150} height={150} className="mx-auto mb-4" />
      <h3 className="text-xl font-bold text-dark-100 dark:text-light-900 mb-2">No resources found</h3>
      <p className="text-dark-300 dark:text-light-700 mb-4">{getEmptyResultsMessage()}</p>
      {searchQuery && (
        <button type="button" onClick={clearSearch} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
          <Image src="/icons/refresh.svg" alt="Clear" width={16} height={16} />
          Clear Search
        </button>
      )}
    </div>
  );

  // Helper function to render resource list content
  const renderResourceListContent = () => {
    if (isLoading) {
      return renderLoading();
    }

    if (error) {
      return (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
          <p>Error: {error.message || 'Failed to load resources'}</p>
        </div>
      );
    }

    if (sortedLinks.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">
        {sortedLinks.map((link) => (
          <div key={link.id} className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-dark-100 dark:text-light-900 mb-2">{link.title}</h3>
            <p className="text-dark-300 dark:text-light-700 mb-3">{link.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {link.tags &&
                link.tags.map((tag) => (
                  <span key={tag} className="bg-primary-500/10 text-primary-500 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
            </div>
            <div className="flex justify-between items-center">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
                Visit Resource
                <Image src="/icons/external-link.svg" alt="External Link" width={16} height={16} />
              </a>
              <div className="text-dark-300 dark:text-light-700 text-xs">{link.views || 0} views</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render the hero section
  const renderHero = () => (
    <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/5 dark:to-secondary-500/5 rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-100 dark:text-light-900 mb-3">DevLinks Hub</h1>
          <p className="text-dark-300 dark:text-light-700 text-lg mb-6">Discover, share, and organize the best developer resources in one place.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowHero(false)} className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
              <Image src="/icons/search.svg" alt="Explore" width={20} height={20} />
              Explore Resources
            </button>
            {!user && (
              <Link href="/auth" className="bg-secondary-500 hover:bg-secondary-600 text-white px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
                <Image src="/icons/user.svg" alt="Sign In" width={20} height={20} />
                Sign In
              </Link>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <Image src={isDarkMode ? '/images/dark-illustration.png' : '/images/light-illustration.png'} alt="DevLinks Hub Illustration" width={400} height={300} className="max-w-full h-auto" priority />
        </div>
      </div>
    </div>
  );

  // Helper function to render featured resources section
  const renderFeaturedResources = () => {
    // Get the top 3 most viewed resources
    const featuredLinks = [...publicLinks].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    if (featuredLinks.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Image src="/icons/star.svg" alt="Featured" width={24} height={24} className="text-yellow-500" />
          <h2 className="text-xl font-bold text-dark-100 dark:text-light-900">Featured Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredLinks.map((link) => (
            <div key={link.id} className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-dark-100 dark:text-light-900 mb-2 line-clamp-1">{link.title}</h3>
              <p className="text-dark-300 dark:text-light-700 mb-3 text-sm line-clamp-2">{link.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {link.tags &&
                  link.tags.slice(0, 3).map((tag) => (
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
      </div>
    );
  };

  // Helper function to render popular tags section
  const renderPopularTags = () => {
    // Count tag occurrences
    const tagOccurrences = {};
    publicLinks.forEach((link) => {
      if (link.tags) {
        link.tags.forEach((tag) => {
          tagOccurrences[tag] = (tagOccurrences[tag] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by count
    const sortedTags = Object.entries(tagOccurrences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    if (sortedTags.length === 0) return null;

    return (
      <div className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Image src="/icons/tag.svg" alt="Tags" width={20} height={20} />
          <h3 className="text-lg font-semibold text-dark-100 dark:text-light-900">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <button key={tag} type="button" onClick={() => setSearchQuery(tag)} className="bg-light-800 dark:bg-dark-400 hover:bg-primary-500/10 hover:text-primary-500 text-dark-300 dark:text-light-700 text-sm px-3 py-1.5 rounded-lg transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Show hero section if showHero is true */}
        {showHero && renderHero()}

        {/* Featured Resources */}
        {!isLoading && !error && renderFeaturedResources()}

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 sticky top-24">
              <div className="space-y-1 mb-6">
                <Link href="/" className="flex items-center gap-2 p-3 bg-primary-500 text-white rounded-lg transition-colors">
                  <Image src="/icons/home.svg" alt="Home" width={20} height={20} />
                  <span className="font-medium">Home</span>
                </Link>

                <Link href="/collections" className="flex items-center gap-2 p-3 text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors">
                  <Image src="/icons/question.svg" alt="Collections" width={20} height={20} />
                  <span className="font-medium">Collections</span>
                </Link>

                <Link href="/tags" className="flex items-center gap-2 p-3 text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors">
                  <Image src="/icons/tag.svg" alt="Tags" width={20} height={20} />
                  <span className="font-medium">Tags</span>
                </Link>

                <Link href="/communities" className="flex items-center gap-2 p-3 text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors">
                  <Image src="/icons/users.svg" alt="Communities" width={20} height={20} />
                  <span className="font-medium">Communities</span>
                </Link>

                <Link href="/add-resource" className="flex items-center gap-2 p-3 text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors">
                  <Image src="/icons/plus.svg" alt="Add Resource" width={20} height={20} />
                  <span className="font-medium">Add Resource</span>
                </Link>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signOut();
                    } catch (signOutError) {
                      console.error('Error signing out:', signOutError);
                    }
                  }}
                  className="flex items-center gap-2 p-3 mt-4 w-full text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors"
                >
                  <Image src="/icons/log-out.svg" alt="Logout" width={20} height={20} />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <button type="button" className="signin-button flex items-center gap-2 p-3 mt-4 w-full text-dark-300 dark:text-light-700 hover:bg-light-800 dark:hover:bg-dark-400 rounded-lg transition-colors">
                  <Image src="/icons/log-in.svg" alt="Login" width={20} height={20} />
                  <span className="font-medium">Login</span>
                </button>
              )}

              {/* Popular Tags Section */}
              {!isLoading && !error && renderPopularTags()}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-6">
            {/* Global Search */}
            <div className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 mb-6">
              <div className="relative">
                <Image src="/icons/search.svg" alt="Search" width={20} height={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-300 dark:text-light-700" />
                <input type="text" placeholder="Search resources..." value={searchQuery} onChange={handleSearch} className="w-full bg-light-800 dark:bg-dark-400 text-dark-100 dark:text-light-900 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {searchQuery && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-300 dark:text-light-700 hover:text-dark-100 dark:hover:text-light-900">
                    <Image src="/icons/x.svg" alt="Clear" width={16} height={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Resource List - Filter buttons removed */}
            {renderResourceListContent()}
          </div>

          {/* Right sidebar - Add Resource CTA */}
          <div className="lg:col-span-3">
            <div className="bg-light-850 dark:bg-dark-300 rounded-lg shadow-sm p-4 sticky top-24">
              <div className="text-center mb-4">
                <Image src="/icons/plus.svg" alt="Add" width={40} height={40} className="mx-auto mb-2 p-2 bg-primary-500/10 text-primary-500 rounded-full" />
                <h3 className="text-lg font-semibold text-dark-100 dark:text-light-900 mb-1">Add Resource</h3>
                <p className="text-dark-300 dark:text-light-700 text-sm mb-4">Share your favorite developer resources with the community</p>
                <Link href="/add-resource" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors inline-block w-full">
                  Add New Resource
                </Link>
              </div>

              {/* Category Filter */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/icons/tag.svg" alt="Categories" width={20} height={20} />
                  <h3 className="text-lg font-semibold text-dark-100 dark:text-light-900">Categories</h3>
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => setSelectedCategory(null)} className="w-full text-left px-3 py-2 rounded-lg text-sm">
                    All Categories
                  </button>
                  {publicCategories.map((category) => (
                    <button key={category.id} type="button" onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)} className="w-full text-left px-3 py-2 rounded-lg text-sm">
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
