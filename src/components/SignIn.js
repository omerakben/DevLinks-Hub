import Image from 'next/image';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div className="flex-center flex-col h-screen background-light850_dark100">
      <div className="flex-center flex-col p-8 background-light900_dark200 rounded-lg shadow-light100_dark100 max-w-md w-full mx-4">
        <div className="flex items-center gap-1 mb-8">
          <Image src="/icons/link.svg" alt="Link icon" width={32} height={32} className="text-primary-500" />
          <h1 className="h2-bold text-dark100_light900 primary-text-gradient">DevLinks</h1>
          <p className="h2-bold text-dark100_light900">Hub</p>
        </div>

        <h2 className="h3-bold text-dark100_light900 mb-2">Welcome!</h2>
        <p className="paragraph-regular text-dark300_light700 mb-8 text-center">Sign in to access your personalized developer resource hub</p>

        <button type="button" className="signin-button flex items-center gap-2 bg-primary-500 hover:bg-primary-100 hover:text-primary-500 text-light-900 paragraph-medium px-6 py-3 rounded-lg transition-colors w-full justify-center" onClick={signIn}>
          <Image src="/icons/google.svg" alt="Google icon" width={20} height={20} />
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default Signin;
