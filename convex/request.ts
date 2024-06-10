import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string(),
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorizated');
        }

        if (args.email === identity.email) {
            throw new ConvexError('Can not send request to user self')
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        const receiver = await ctx.db.query('users').withIndex('by_email', (q) => q.eq('email', args.email)).unique();

        if (!receiver) {
            throw new ConvexError('can not find the receiver this email send to');
        }



        const requestAlreadySent = await ctx.db.query('requests')
            .withIndex('by_receiver_sender', (q) => q.eq('receiver', receiver._id).eq('sender', currentUser._id))
            .unique();


        if (requestAlreadySent) {
            throw new ConvexError('Request already sent');
        }


        const requestAlreadyReceived = await ctx.db.query('requests')
            .withIndex('by_receiver_sender', (q) => q.eq('receiver', currentUser._id).eq('sender', receiver._id))
            .unique();

        if (requestAlreadyReceived) {
            throw new ConvexError('Request already received');
        }

        const alreadyFriend = await ctx.db.query('conversations')
            .withIndex('by_user1_user2', (q) => q.eq('user1', currentUser._id).eq('user2', receiver._id)).first();

        const alreadyFriend2 = await ctx.db.query('conversations')
            .withIndex('by_user1_user2', (q) => q.eq('user1', receiver._id).eq('user2', currentUser._id)).first();

        if(alreadyFriend || alreadyFriend2){
            throw new ConvexError('You guys already friend');
        }

        const request = await ctx.db.insert('requests', {
            sender: currentUser._id,
            receiver: receiver._id
        })

        return request

    }
})


export const getFrindRequest = query({
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


        const friendsRequest = await ctx.db.query('requests')
            .withIndex('by_receiver_sender', (q) => q.eq('receiver', currentUser._id)).collect();


        const friendsInformationPromises = friendsRequest.map(async (request) => {
            const user = await ctx.db.query('users')
                .withIndex('by_id', (q) => q.eq('_id', request.sender))
                .unique();

            return user;
        })

        const friendsInformation = await Promise.all(friendsInformationPromises);

        return friendsInformation;
    }
})

export const rejectRequest = mutation({
    args: {
        rejectUserId: v.id('users')
    }, handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorizated')
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        const requestGetRejected = await ctx.db.query('requests')
            .withIndex('by_receiver_sender', (q) => q.eq('receiver', currentUser._id).eq('sender', args.rejectUserId)).first()

        if (requestGetRejected) {
            await ctx.db.delete(requestGetRejected._id)
        }
        else {
            throw new ConvexError('the request already delete')
        }
    },
})

export const acceptRequest = mutation({
    args: {
        friendId: v.id('users')
    }, handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorizated')
        }

        const currentUser = await getUserByClerkId({ ctx, clerkId: identity.subject });

        if (!currentUser) {
            throw new ConvexError('User not found')
        }

        const requestGetRejected = await ctx.db.query('requests')
            .withIndex('by_receiver_sender', (q) => q.eq('receiver', currentUser._id).eq('sender', args.friendId)).first()

        if (!requestGetRejected) {
            throw new ConvexError('Request can not found')
        }

        await ctx.db.delete(requestGetRejected?._id)


        await ctx.db.insert('conversations', {
            user1: currentUser._id,
            user2: args.friendId,
        })
    }
})



