import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userCv: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    documentJson: v.string(),
    themeJson: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .index("by_tokenIdentifier_updatedAt", ["tokenIdentifier", "updatedAt"]),
});
