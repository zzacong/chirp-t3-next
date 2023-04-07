import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { PageLayout } from '~/components/layout';
import { generateSSGHelper } from '~/server/utils';
import { api } from '~/utils/api';

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data } = api.profile.getByUsername.useQuery({
    username,
  });

  if (!data)
    return (
      <div>
        <p>404 User not found.</p>
      </div>
    );

  return (
    <>
      <Head>
        <title>{data.username} | Chirp T3</title>
      </Head>

      <PageLayout>
        <div className="relative h-36 bg-zinc-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ''}'s profile picture`}
            width={128}
            height={128}
            className="absolute bottom-0 left-6 -mb-16 rounded-full border-2 border-zinc-400 bg-black"
          />
        </div>
        <div className="pt-16"></div>
        <div className="border-b border-zinc-400 p-6 pl-7">
          <h1 className="text-xl font-bold md:text-2xl">{`@${
            data.username ?? ''
          }`}</h1>
        </div>
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
  const username = slug.replace(/^[@]/, '');
  await ssg.profile.getByUsername.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export default ProfilePage;
