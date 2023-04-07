import { type NextPage } from 'next';
import Head from 'next/head';
import PageLayout from '~/components/PageLayout';

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post | Chirp T3</title>
      </Head>

      <PageLayout></PageLayout>
    </>
  );
};

export default SinglePostPage;
