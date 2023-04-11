import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';

export const config = {
  runtime: 'edge',
};

// export API handler
export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : undefined,
  });
}
