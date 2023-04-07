import { type NextPage } from 'next';
import Head from 'next/head';

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post | Chirp T3</title>
      </Head>

      <div className="flex flex-1 justify-center bg-gradient-to-b from-white to-zinc-100 px-6 dark:from-zinc-950 dark:to-zinc-950">
        <main className="relative w-full border-x border-zinc-400 md:max-w-3xl"></main>
      </div>
    </>
  );
};

export default SinglePostPage;
