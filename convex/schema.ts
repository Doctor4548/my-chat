import {defineSchema, defineTable} from 'convex/server'
import { v } from 'convex/values'
export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string()
    }).index('by_email',['email']).index('by_clerkId', ['clerkId']),

    requests: defineTable({
        sender: v.id('users'),
        receiver: v.id('users'),
    }).index('by_receiver', ['receiver']).index('by_receiver_sender', ['receiver','sender']),

    conversations: defineTable({
        user1: v.id('users'),
        user2: v.id('users'),
        lastMessage: v.optional(v.string())
    }).index('by_user1',['user1']).index('by_user2', ['user2']).index('by_user1_user2', ['user1', 'user2']),

    messages: defineTable({
        content: v.string(),
        author: v.id('users'),
        conversationId: v.id('conversations'),
    }).index('by_conversations', ['conversationId'])


})