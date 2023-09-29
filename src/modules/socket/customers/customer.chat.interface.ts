export interface CustomerChat {
    userId: string;
    adminId?: string;
    content: string;
    time: string;
    replyToId?: string;
    discordChannelId: string;
}