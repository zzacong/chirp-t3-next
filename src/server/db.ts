import { connect } from '@planetscale/database';
import { env } from '~/env.mjs';

export const db = connect({ url: env.DATABASE_URL });
