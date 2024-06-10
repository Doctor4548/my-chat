import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";



export const sendMessage = mutation({
    args: {
        conversationId: v.id('conversations'),
        content: v.string(),
    }, handler: async(ctx, args)=>{
        
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorizated');
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        ctx.db.patch(args.conversationId, {lastMessage: args.content})


        ctx.db.insert('messages', {
            conversationId: args.conversationId,
            content: args.content,
            author: currentUser._id
        })
    }
})



export const getMessage = query({
    args: {
        conversationId: v.id('conversations'),
        pageOfMessage: v.number()
    },handler: async(ctx, args)=>{

        const identity = await ctx.auth.getUserIdentity();
        

        if (!identity) {
            throw new ConvexError('Unauthorizated');
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        const messages = await ctx.db.query('messages')
            .withIndex('by_conversations', (q)=>q.eq('conversationId', args.conversationId)).collect();

        
        return messages

    }
})