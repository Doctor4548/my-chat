import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";



export const getFriends = query({
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


        const user1Conversation = await ctx.db.query('conversations')
            .withIndex('by_user1', (q) => q.eq('user1', currentUser._id))
            .collect();



        const friends1InformationPromises = user1Conversation.map(async (item) => {
            const user = await ctx.db.query('users')
                .withIndex('by_id', (q) => q.eq('_id', item.user2))
                .unique();


            return {...user, conversationId:item._id, lastMessage: item?.lastMessage};
        })

        const user2Conversation = await ctx.db.query('conversations')
            .withIndex('by_user2', (q) => q.eq('user2', currentUser._id))
            .collect();



        const friends2InformationPromises = user2Conversation.map(async (item) => {
            const user = await ctx.db.query('users')
                .withIndex('by_id', (q) => q.eq('_id', item.user1))
                .unique();

            return {...user, conversationId:item._id, lastMessage: item?.lastMessage};
        })

        const friendsInformationPromises = [...friends1InformationPromises, ...friends2InformationPromises]

        const friendsInformation = await Promise.all(friendsInformationPromises);
        return friendsInformation;
    }
})

