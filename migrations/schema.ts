import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, varchar, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm/sql"


export const post = mysqlTable("Post", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	createdAt: datetime("createdAt", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime("updatedAt", { mode: 'string', fsp: 3 }).notNull(),
	content: varchar("content", { length: 255 }).notNull(),
	authorId: varchar("authorId", { length: 191 }).notNull(),
},
(table) => {
	return {
		authorIdIdx: index("Post_authorId_idx").on(table.authorId),
	}
});