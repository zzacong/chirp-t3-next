import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Head from 'next/head';
import PageLayout from '~/components/PageLayout';
import { generateSSGHelper } from '~/server/utils';
import { api } from '~/utils/api';

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  username,
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
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
        <title>Profile | Chirp T3</title>
      </Head>

      <PageLayout>
        <h1>{data.username}</h1>
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
  await ssg.profile.getUserByUsername.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export default ProfilePage;
