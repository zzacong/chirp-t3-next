import { type NextPage } from 'next';
import { SignedIn, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

import { api } from '~/utils/api';
import { Spinner } from '~/components/spinner';
import { PageLayout } from '~/components/layout';
import { PostView } from '~/components/post-view';

const CreatePostWizard = () => {
  const { user } = useUser();
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess() {
      form.current?.reset();
      input.current?.focus();
      void ctx.posts.getAll.invalidate();
    },
    onError(error) {
      const message = error.data?.zodError?.fieldErrors.content;
      if (message?.[0]) toast.error(message[0]);
      else toast.error('Failed to post. Please try again later.');
    },
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const content = form.get('content');
    if (typeof content !== 'string') return;
    mutate({ content });
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 border-b border-zinc-400 px-4 py-6 md:gap-6 md:px-6 md:py-8">
      <Image
        src={user.profileImageUrl}
        alt="Profile picture"
        className="h-10 w-10 rounded-full md:h-12 md:w-12"
        width={48}
        height={48}
      />
      <form
        ref={form}
        onSubmit={onSubmit}
        className="relative flex flex-grow items-center"
      >
        <input
          ref={input}
          type="text"
          name="content"
          placeholder="Type some emojis!"
          disabled={isPosting}
          className="w-full rounded-full border-none bg-gray-200 px-6 py-2 text-lg text-zinc-800 placeholder:text-sm placeholder:italic focus:bg-transparent focus:ring-zinc-400 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-400 md:px-8 md:py-3"
        />
        {isPosting && <Spinner size={24} className="absolute right-4" />}
      </form>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <Spinner size={96} />
      </div>
    );

  if (!data)
    return (
      <div className="absolute inset-0 grid place-items-center">
        <p className="text-xl text-black dark:text-white">
          Something went wrong
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

const Home: NextPage = () => {
  // Start fetching asap
  api.posts.getAll.useQuery();

  return (
    <PageLayout>
      <div>
        <SignedIn>
          <CreatePostWizard />
        </SignedIn>
      </div>

      <Feed />
    </PageLayout>
  );
};

export default Home;
