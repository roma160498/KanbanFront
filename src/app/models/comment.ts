export class Comment {
    id: number;
    text: string;
    issue_id: number;
    parentComment_id: number;
    user_id: number;
    user_name: string;
    date: string;
    comments: any[];
    mentions: any[];
}