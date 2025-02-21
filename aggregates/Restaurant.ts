import { ReviewEntity } from "./entities/Review";
import {ReviewService} from "../services/ReviewService";
import {ReviewDTO} from "../DTO/ReviewDTO";
import {RestaurantRepository} from "../repositories/RestaurantRepository";

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
  private restaurantReviews: ReviewEntity[];

  private reviewService: ReviewService | null = null;
  private fetcher: ((restaurantId: string, offset: number, limit: number) => Promise<ReviewEntity[]>) | null = null;
  private startIndex: number = 0;
  private numTimesLoaded: number = -1;

  private newReview: ReviewEntity | null = null;
  private modifiedReview: ReviewEntity | null = null;

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

  public loadReviewService(reviewService: ReviewService) {
    this.reviewService = reviewService;
    this.fetcher = reviewService.allowFetchReviewEntities(this)
  }

  // Change to public if external callers need (like services or UI layers) need to pre-validate before constructing or modifying a review. Else, make it private.
  private validateReviewContent(reviewContent: string) {
    if(reviewContent.length < 1){
      throw new Error("Review content cannot be empty");
    }else if(reviewContent.length > 500){
      throw new Error("Review content cannot exceed 500 characters");
    }
  }

  public async loadReviews() {
    if(!this.fetcher) {
      throw new Error("fetcher has not been defined");
    }
    const newReviews = await this.fetcher(this.restaurantName, this.startIndex, 10);
    this.restaurantReviews.push(...newReviews)
    this.startIndex += 10;
    this.numTimesLoaded += 1;
  }


  public addNewReview(reviewData: Omit<ReviewEntity, 'restaurantName'>): ReviewEntity {
    const newReview = new ReviewEntity({...reviewData, restaurantName: this.restaurantName});
    this.validateReviewContent(newReview.mainReview);
    this.newReview = newReview;
    return newReview;
  }

  public addModifiedReview(reviewData: Omit<ReviewEntity, 'restaurantName'>): ReviewEntity {
    const newReview = new ReviewEntity({...reviewData, restaurantName: this.restaurantName});
    this.validateReviewContent(newReview.mainReview);
    this.modifiedReview = newReview;
    return newReview;
  }

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

  public getNumReviews() {
    return this.restaurantReviews.length;
  }

  public getReviews(): ReviewDTO[] {
    return this.restaurantReviews.slice(this.numTimesLoaded * 10).map(review => ({
      reviewId: review.reviewId,
      username: review.username,
      reviewDate: review.reviewDate,
      restaurantName: review.restaurantName,
      reviewSubject: review.reviewSubject,
      mainReview: review.mainReview,
      reviewRating: review.reviewRating,
      isEdited: review.isEdited,
      helpfulCount: review.helpfulCount,
      gallery: review.gallery,
      ownerReplied: review.ownerReplied
    }));

  }

  public getNewReview(caller: any) {
    if(!(caller instanceof RestaurantRepository)) {
      throw new Error("Only a restaurant repository can call this");
    }

    return this.newReview
  }

  public getModifiedReviews(caller: any) {
    if(!(caller instanceof RestaurantRepository)) {
      throw new Error("Only a restaurant repository can call this");
    }

    return this.modifiedReview
  }

  public setFileLocationsNewReview(fileLocations: string[]) {
    if(!this.newReview){
      throw new Error("No new reviews...")
    }
    this.newReview.fileLocations = fileLocations;
  }
  public setFileLocationsModifiedReview(fileLocations: string[]) {
    if(!this.modifiedReview){
      throw new Error("No modified reviews...")
    }
    this.modifiedReview.fileLocations = fileLocations;
  }
s
}
