/**
 * Unlike a review entity owned by the restaurant, a review DTO is
 * primarily used for read-only operations. It does not have methods
 * that let you add comments, modify comments, or delete comments.
 */

export interface ReviewDTO {
  //TODO: Implement properties of a review
  /* NOTE: Do not include user info like their profile picture or name,
   * just add a user_id property.
   */
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
  comments?: CommentDTO[];
  ownerReplied: boolean;
}


export interface CommentDTO {
  commentId: string;
  userId: string;
  reviewId: string;
  commentContent: string;
  commentDate: string;
}
