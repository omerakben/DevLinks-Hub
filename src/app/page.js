'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import NavBar from '@/components/NavBar';
import { useAuth } from '@/utils/context/authContext';

function Home() {
  const { user, userLoading } = useAuth();

  if (userLoading) {
    return (
      <div className="flex-center h-screen w-full">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary-500" />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <section className="flex-center flex-col gap-8 px-4 py-12 md:px-16 md:py-24">
        <div className="flex-center flex-col text-center max-w-3xl">
          <h1 className="h1-bold text-dark100_light900">
            Welcome to <span className="primary-text-gradient">DevLinks Hub</span>
          </h1>
          <p className="paragraph-regular text-dark300_light700 mt-4">A platform to share and discover developer resources</p>

          {user && (
            <div className="flex-center flex-col mt-8 p-6 background-light900_dark300 rounded-lg shadow-light100_dark100">
              <h2 className="h3-bold text-dark100_light900">Hello, {user.displayName}!</h2>
              <p className="paragraph-regular text-dark300_light700 mt-2">You are signed in with {user.email}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
