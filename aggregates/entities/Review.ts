import { CommentProps, CommentEntity } from "./Comment";

export interface ReviewProps{
  reviewId: string | null;
  username: string;
  restaurantName: string;
  reviewSubject: string;
  mainReview: string;
  reviewRating: number;
  reviewDate: Date;
  isEdited: boolean;
  helpfulCount: number;
  gallery?: string[];
  comments?: CommentEntity[];

}


export class ReviewEntity {
  public readonly reviewId: string | null = null; //indicator if it's a new review (null id) or existing review (has an id)
  public readonly username: string;
  public readonly restaurantName: string
  public reviewSubject: string;
  public mainReview: string;
  public reviewRating: number;
  public readonly reviewDate: Date;
  public isEdited: boolean;
  public helpfulCount: number;
  public gallery: string[];
  public comments: CommentEntity[];

  constructor(props: ReviewProps) {
    this.reviewId = props.reviewId;
    this.username = props.username;
    this.restaurantName = props.restaurantName;
    this.reviewSubject = props.reviewSubject;
    this.mainReview = props.mainReview;
    this.reviewRating = props.reviewRating;
    this.reviewDate = props.reviewDate;
    this.isEdited = props.isEdited;
    this.helpfulCount = props.helpfulCount;
    this.gallery = props.gallery || [];
    this.comments = props.comments || [];
  }

  //TODO: Implement method to addComment()
  public addComment(commentData: Omit<CommentProps, 'reviewId'>): CommentEntity {
    const newComment = new CommentEntity({...commentData, reviewId: this.reviewId});
    this.comments.push(newComment);
    return newComment;
  }


  //TODO: Implement method to modifyComment()
  public deleteComment(commentId: string): boolean{
    const initialLength = this.comments.length;
    this.comments = this.comments.filter(comment => comment.commentId !== commentId);
    if(this.comments.length === initialLength){
      return false;
    }
    return true;
  }


}
