import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Head from 'next/head';

import { PageLayout } from '~/components/layout';
import { PostView } from '~/components/post-view';
import { generateSSGHelper } from '~/server/utils';
import { api } from '~/utils/api';

const SinglePostPage: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ postId }) => {
  const { data } = api.posts.getById.useQuery({ id: postId });

  if (!data)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-2xl font-semibold tracking-wider md:text-4xl">
          🚧 404 Post not found
        </p>
      </div>
    );

  return (
    <>
      <Head>
        <title>
          {`${data.post.content} - @${data.author.username}`} | Chirp T3 @ Edge
        </title>
      </Head>

      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<{
  postId: string;
}> = async ctx => {
  const ssg = generateSSGHelper();
  const postId = ctx.params?.id;
  if (typeof postId !== 'string') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  await ssg.posts.getById.prefetch({ id: postId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export default SinglePostPage;
