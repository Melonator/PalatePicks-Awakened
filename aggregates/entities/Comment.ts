export interface CommentProps {
  commentId: string;
  reviewId: string;
  username: string;
  commentContent: string;
  commentDate: Date;

}

export class CommentEntity {
  public readonly commentId: string;
  public readonly reviewId: string;
  public readonly username: string;
  public content: string;
  public readonly commentDate: Date;

  constructor(props: CommentProps) {
    this.commentId = props.commentId;
    this.reviewId = props.reviewId;
    this.username = props.username;
    this.content = props.commentContent;
    this.commentDate = props.commentDate;
  }

  public updateCommentContent(newContent: string): void {
    if(newContent.length < 1){
      throw new Error("Comment content cannot be empty");
    }
    this.content = newContent;
  }


}
