import { authedProcedure, router } from "../trpc";
import { db } from "../index";
import { projectTable, projectTableValidator } from "../models/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const projects = router({
  getAll: authedProcedure.query((opts) => {
    return db
      .select()
      .from(projectTable)
      .where(eq(projectTable.authorId, opts.ctx.user.id))
      .execute();
  }),
  delete: authedProcedure.input(z.string()).mutation(async (opts) => {
    const userId = opts.ctx.user.id;
    const targetId = opts.input;

    const [draft] = await db
      .select()
      .from(projectTable)
      .where(eq(projectTable.id, targetId))
      .execute();
    if (!draft) throw new TRPCError({ code: "NOT_FOUND" });

    if (draft.authorId !== userId)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    await db.delete(projectTable).where(eq(projectTable.id, targetId));

    return "done";
  }),
  create: authedProcedure.input(projectTableValidator).mutation((opts) => {
    const userId = opts.ctx.user.id;
    return db
      .insert(projectTable)
      .values({ ...opts.input, authorId: userId })
      .execute();
  }),
  update: authedProcedure
    .input(projectTableValidator)
    .mutation(async (opts) => {
      const userId = opts.ctx.user.id;
      const targetId = opts.input.id;

      const [draft] = await db
        .select()
        .from(projectTable)
        .where(eq(projectTable.id, targetId))
        .execute();
      if (!draft) throw new TRPCError({ code: "NOT_FOUND" });

      if (draft.authorId !== userId)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      return db
        .update(projectTable)
        .set(opts.input)
        .where(eq(projectTable.id, targetId))
        .execute();
    }),
});
