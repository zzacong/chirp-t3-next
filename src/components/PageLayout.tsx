import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const PageLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <>
      <header className="z-10 grid grid-cols-3 place-items-center bg-white px-6 py-4 drop-shadow-md dark:border-b dark:border-zinc-400 dark:bg-zinc-950 dark:drop-shadow-none md:py-6">
        <span>&nbsp;</span>
        <Link
          href="/"
          className="font-mono text-lg font-bold uppercase text-black dark:text-white md:text-2xl"
        >
          Chirp T3
        </Link>
        <div className="place-self-end">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded bg-zinc-900 px-3 py-1 font-mono text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 md:px-4 md:text-base">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-10 h-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </header>
      <div className="flex flex-1 justify-center bg-gradient-to-b from-white to-zinc-100 px-6 dark:from-zinc-950 dark:to-zinc-950">
        <main className="relative w-full border-x border-zinc-400 md:max-w-3xl">
          {children}
        </main>
      </div>
    </>
  );
};

export default PageLayout;
