export interface CommentProps {
  commentId: string;
  reviewId: string | null;
  username: string;
  commentContent: string;
  commentDate: Date;

}

export class CommentEntity {
  public readonly commentId: string | null = null;
  public readonly reviewId: string | null = null;
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
    }else if(newContent.length > 500){
      throw new Error("Comment content cannot exceed 500 characters");
    }
    this.content = newContent;
  }


}
