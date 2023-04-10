import { type User } from '@clerk/nextjs/dist/api';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';
import { appRouter } from '~/server/api/root';
import { db } from '~/server/db';

export const filterUserForClient = <const T extends User>(user: T) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};

export const generateSSGHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

export const fakeCuid = () =>
  crypto.randomUUID().replaceAll('-', '').slice(0, 25);
