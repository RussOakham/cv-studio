import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const cvSummaryValue = v.object({
  _id: v.id("userCv"),
  name: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

const cvRecordValue = v.object({
  _id: v.id("userCv"),
  name: v.string(),
  documentJson: v.string(),
  themeJson: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

async function requireIdentityToken(ctx: {
  auth: { getUserIdentity: () => Promise<{ tokenIdentifier: string } | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.tokenIdentifier;
}

export const getMyCv = query({
  args: {},
  returns: v.union(cvRecordValue, v.null()),
  handler: async (ctx) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const record = await ctx.db
      .query("userCv")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!record) {
      return null;
    }

    return {
      _id: record._id,
      name: record.name,
      documentJson: record.documentJson,
      themeJson: record.themeJson,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },
});

export const listMyCvs = query({
  args: {},
  returns: v.array(cvSummaryValue),
  handler: async (ctx) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const rows = await ctx.db
      .query("userCv")
      .withIndex("by_tokenIdentifier_updatedAt", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .collect();
    return rows
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((row) => ({
        _id: row._id,
        name: row.name ?? "Untitled CV",
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));
  },
});

export const getCvById = query({
  args: { cvId: v.id("userCv") },
  returns: v.union(cvRecordValue, v.null()),
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const record = await ctx.db.get(args.cvId);
    if (!record || record.tokenIdentifier !== tokenIdentifier) {
      return null;
    }
    return {
      _id: record._id,
      name: record.name ?? "Untitled CV",
      documentJson: record.documentJson,
      themeJson: record.themeJson,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },
});

export const createCv = mutation({
  args: {
    name: v.string(),
    documentJson: v.string(),
    themeJson: v.string(),
  },
  returns: v.id("userCv"),
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const now = Date.now();
    return await ctx.db.insert("userCv", {
      tokenIdentifier,
      name: args.name,
      documentJson: args.documentJson,
      themeJson: args.themeJson,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCv = mutation({
  args: {
    cvId: v.id("userCv"),
    name: v.optional(v.string()),
    documentJson: v.string(),
    themeJson: v.string(),
  },
  returns: cvRecordValue,
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const now = Date.now();

    const existing = await ctx.db.get(args.cvId);
    if (!existing || existing.tokenIdentifier !== tokenIdentifier) {
      throw new Error("CV not found");
    }
    await ctx.db.patch(existing._id, {
      name: args.name ?? existing.name,
      documentJson: args.documentJson,
      themeJson: args.themeJson,
      updatedAt: now,
    });
    return {
      _id: existing._id,
      name: args.name ?? existing.name ?? "Untitled CV",
      documentJson: args.documentJson,
      themeJson: args.themeJson,
      createdAt: existing.createdAt,
      updatedAt: now,
    };
  },
});

export const renameCv = mutation({
  args: {
    cvId: v.id("userCv"),
    name: v.string(),
  },
  returns: v.object({
    _id: v.id("userCv"),
    name: v.string(),
    updatedAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const existing = await ctx.db.get(args.cvId);
    if (!existing || existing.tokenIdentifier !== tokenIdentifier) {
      throw new Error("CV not found");
    }
    const now = Date.now();
    await ctx.db.patch(existing._id, {
      name: args.name,
      updatedAt: now,
    });
    return { _id: existing._id, name: args.name, updatedAt: now };
  },
});

export const deleteCv = mutation({
  args: { cvId: v.id("userCv") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityToken(ctx);
    const existing = await ctx.db.get(args.cvId);
    if (!existing || existing.tokenIdentifier !== tokenIdentifier) {
      throw new Error("CV not found");
    }
    await ctx.db.delete(args.cvId);
    return null;
  },
});
