import { Ratelimit } from '@upstash/ratelimit'; // for deno: see above
import { Redis } from '@upstash/redis';
import { clerkClient } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { type InferModel, desc, eq, sql } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { fakeCuid, filterUserForClient } from '~/server/utils';
import { post } from '~/../migrations/schema';

const addUserDataToPosts = async (posts: InferModel<typeof post>[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map(p => p.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);
  return posts.map(post => {
    const author = users.find(u => u.id === post.authorId);
    if (!author || !author.username)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Author for post (${post.id}) not found`,
      });

    return {
      post,
      author: {
        id: author.id,
        username: author.username,
        profileImageUrl: author.profileImageUrl,
      },
    };
  });
};

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@upstash/ratelimit',
});

export const postsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(post)
        .where(eq(post.id, input.id))
        .limit(1);
      if (rows.length === 0) throw new TRPCError({ code: 'NOT_FOUND' });
      return (await addUserDataToPosts(rows))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(post)
      .orderBy(desc(post.createdAt))
      .limit(100);
    return addUserDataToPosts(rows);
  }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(post)
        .where(eq(post.authorId, input.userId))
        .orderBy(desc(post.createdAt))
        .limit(100);
      if (rows.length === 0) throw new TRPCError({ code: 'NOT_FOUND' });
      return addUserDataToPosts(rows);
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().emoji('Only emojis are allowed!').min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;
      const { success } = await ratelimit.limit(authorId);
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

      const result = await ctx.db.insert(post).values({
        id: fakeCuid(),
        content: input.content,
        authorId: authorId,
        updatedAt: sql`current_timestamp(3)`,
      });

      if (result.rowsAffected === 0)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }),
});
