import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { type RouterOutputs } from '~/utils/api';

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs['posts']['getAll'][number];

export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <li className="flex items-center gap-4 border-b border-zinc-400 p-4 md:gap-6 md:p-6">
      <Link href={`/${author.username}`}>
        <Image
          src={author.profileImageUrl}
          alt={`${author.username}'s profile picture`}
          className="h-10 w-10 rounded-full md:h-12 md:w-12"
          width={48}
          height={48}
        />
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-x-1 text-sm text-zinc-500">
          <Link
            href={`/${author.username}`}
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <span className="font-medium">{`@${author.username}`}</span>
          </Link>
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-x-1 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <span>•</span>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <p className="text-xl md:text-2xl">{post.content}</p>
      </div>
    </li>
  );
};
