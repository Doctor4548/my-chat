import { internalMutation, internalQuery, query } from './_generated/server';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';
import { getUserByClerkId } from './_utils';

export const getUserInfo = query({
    args: {

    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();


        if (!identity) {
            throw new ConvexError('Unauthorizated');
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        return currentUser
    }
});

export const getFriend = query({
    args: {
        conversationId: v.id('conversations')
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();


        if (!identity) {
            throw new ConvexError('Unauthorizated');
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        const conversation = await ctx.db.query('conversations')
            .withIndex('by_id', (q) => q.eq('_id', args.conversationId)).unique();

        if (!conversation) {
            throw new ConvexError('conversation not found');
        }

        if (currentUser._id !== conversation.user1) {
            const friendInfo = await ctx.db.query('users')
                .withIndex('by_id', (q) => q.eq('_id', conversation.user1)).unique();

            return friendInfo;
        } else {
            const friendInfo = await ctx.db.query('users')
                .withIndex('by_id', (q) => q.eq('_id', conversation.user2)).unique();

            return friendInfo;
        }

    }
})

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string()
    }, handler: async (ctx, args) => {
        await ctx.db.insert('users', args)
    }
})

export const get = internalQuery({
    args: {
        clerkId: v.string()
    }, handler: async (ctx, args) => {
        return ctx.db.query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .unique()
    }
})


