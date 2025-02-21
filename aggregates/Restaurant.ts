import { ReviewEntity } from "./entities/Review";

export interface RestaurantProps {
  restaurantId: string;
  restaurantName: string;
  restaurantHeader: string;
  restaurantDescription: string;
  restaurantRating: Number;
  restaurantPrice: Number;
  restaurantGallery?: string[];
  restaurantReviews?: ReviewEntity[];
}


export class Restaurant {
  public readonly restaurantId: string;
  public restaurantName: string;
  public restaurantHeader: string;
  public restaurantDescription: string;
  public restaurantRating: Number;
  public restaurantPrice: Number;
  public restaurantGallery: string[];
  public restaurantReviews: ReviewEntity[]; //TODO: A restaurant is responsible for its reviews. Use the review entity as one of its properties


  //TODO: Implement properties of a restaurant like its id, name, profile image, etc.
  constructor(props: RestaurantProps){
    this.restaurantId = props.restaurantId;
    this.restaurantName = props.restaurantName;
    this.restaurantHeader = props.restaurantHeader;
    this.restaurantDescription = props.restaurantDescription;
    this.restaurantRating = props.restaurantRating;
    this.restaurantPrice = props.restaurantPrice;
    this.restaurantGallery = props.restaurantGallery || [];
    this.restaurantReviews = props.restaurantReviews || [];
  }

  // Change to public if external callers need (like services or UI layers) need to pre-validate before constructing or modifying a review. Else, make it private.
  private validateReviewContent(reviewContent: string) {
    if(reviewContent.length < 1){
      throw new Error("Review content cannot be empty");
    }else if(reviewContent.length > 500){
      throw new Error("Review content cannot exceed 500 characters");
    }
  }

  //TODO: Implement method to addReview()
  public addReview(reviewData: Omit<ReviewEntity, 'restaurantName'>): ReviewEntity {
    const newReview = new ReviewEntity({...reviewData, restaurantName: this.restaurantName});
    this.validateReviewContent(newReview.mainReview);
    this.restaurantReviews.push(newReview);
    return newReview;
  }

  //TODO: Implement method to deleteReview()
  public deleteReview(reviewId: string): boolean{
    const initialLength = this.restaurantReviews.length;
    this.restaurantReviews = this.restaurantReviews.filter(review => review.reviewId !== reviewId);
    if(this.restaurantReviews.length === initialLength){
      return false;
    }
    return true;
  }

  //TODO: Implement method to modifyReview()
  public modifyReview(reviewId: string, newReviewData: Omit<ReviewEntity, 'restaurantName'>){
    const reviewIndex = this.restaurantReviews.findIndex(review => review.reviewId === reviewId);
    if(reviewIndex === -1){
      throw new Error("Review not found");
    }
    this.validateReviewContent(this.restaurantReviews[reviewIndex].mainReview);
    this.restaurantReviews[reviewIndex] = new ReviewEntity({...newReviewData, restaurantName: this.restaurantName});
  }






}
