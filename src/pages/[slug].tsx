import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { PageLayout } from '~/components/layout';
import { PostView } from '~/components/post-view';
import { Spinner } from '~/components/spinner';
import { generateSSGHelper } from '~/server/utils';
import { api } from '~/utils/api';

const ProfileFeed = ({ userId }: { userId: string }) => {
  const { data, isLoading } = api.posts.getByUserId.useQuery({ userId });
  if (isLoading)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Spinner size={80} />
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="pt-12 text-center">
        <p className="text-lg font-semibold italic tracking-wider md:text-2xl">
          User has not posted
        </p>
      </div>
    );

  return (
    <div>
      <ul className="flex flex-col">
        {data.map(row => (
          <PostView key={row.post.id} {...row} />
        ))}
      </ul>
    </div>
  );
};

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data } = api.profile.getByUsername.useQuery({ username });

  if (!data)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-2xl font-semibold tracking-wider md:text-4xl">
          🚧 404 User not found
        </p>
      </div>
    );

  return (
    <>
      <Head>
        <title>{data.username} | Chirp T3 @ Edge</title>
      </Head>

      <PageLayout>
        <div className="relative h-28 bg-slate-400 dark:bg-zinc-600 md:h-36">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ''}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-6 -mb-10 h-20 w-20 rounded-full border-2 border-zinc-600 bg-black shadow dark:border-zinc-400 md:-mb-16 md:h-32 md:w-32"
          />
        </div>
        <div className="pt-8 md:pt-16"></div>
        <div className="border-b border-zinc-400 px-7 pb-6 pt-4 md:py-6">
          <h1 className="text-lg font-bold md:text-2xl">{`@${
            data.username ?? ''
          }`}</h1>
        </div>

        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<{
  username: string;
}> = async ctx => {
  const ssg = generateSSGHelper();
  const slug = ctx.params?.slug;
  if (typeof slug !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  await ssg.profile.getByUsername.prefetch({ username: slug });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: slug,
    },
  };
};

export default ProfilePage;
