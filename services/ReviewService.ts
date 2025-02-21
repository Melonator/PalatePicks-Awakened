import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {ReviewDTO} from "../DTO/ReviewDTO";
import {ReviewEntity, ReviewProps} from "../aggregates/entities/Review";
import {Restaurant} from "../aggregates/Restaurant";
import {CommentEntity, CommentProps} from "../aggregates/entities/Comment";

export class ReviewService {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns all reviews made by a user
  async findByUser(userId: string): Promise<ReviewDTO[]> {
    const {data, error} = await this.supabase
      .from('reviews')
      .select()
      .eq('reviewer_username', userId)

    if(error) {
      throw error;
    }

    if(!data) {
      throw new Error('No Reviews Found');
    }

    const reviews: ReviewDTO[] = []
    for(let i = 0; i < data.length; i++) {
      reviews.push({
        reviewId: data[i].review_id,
        reviewSubject: data[i].review_subject,
        mainReview: data[i].content,
        reviewRating: data[i].rating,
        helpfulCount: data[i].helpful_count,
        username: data[i].reviewer_username,
        restaurantName: data[i].resto_name,
        gallery: data[i].review_gallery,
        reviewDate: data[i].created_at,
        isEdited: data[i].is_edited,
        ownerReplied: data[i],
      })
    }

    return reviews;
  }

  //returns reviews of a restaurant, limited by the offset and limit
  private async findByRestaurantPaginated(restaurantId: string, offset: number, limit: number) {
    const {data, error} = await this.supabase
      .from('reviews')
      .select('*, comments:comments(*)'
      )
      .eq('resto_name', restaurantId)
      .range(offset, limit + offset - 1)

    console.log(data)
    const reviews: ReviewEntity[] = []

    if(error) {
      throw error
    }

    for(let i = 0; i < data.length; i++) {
      const comments: CommentEntity[] = []
      for(let j = 0; j < data[i].comments.length; j++) {
        const commentProps: CommentProps = {
          commentId: data[i].comments[j].id,
          reviewId: data[i].comments[j].review_ref,
          username: data[i].comments[j].username,
          commentContent: data[i].comments[j].content,
          commentDate: data[i].comments[j].created_at,
        }

        comments.push(new CommentEntity(commentProps))
      }
      const reviewProps: ReviewProps = {
        reviewId: data[i].review_id,
        reviewSubject: data[i].review_subject,
        mainReview: data[i].content,
        reviewRating: data[i].rating,
        helpfulCount: data[i].helpful_count,
        username: data[i].reviewer_username,
        restaurantName: data[i].resto_name,
        gallery: data[i].review_gallery,
        reviewDate: data[i].created_at,
        isEdited: data[i].is_edited,
        ownerReplied: data[i].owner_replied,
        comments: comments
      }

      reviews.push(new ReviewEntity(reviewProps))
    }

    return reviews;
  }
  public allowFetchReviewEntities(caller: any) {
    if (!(caller instanceof Restaurant)) {
      throw new Error('Only a restaurant can fetch its reviews')
    }
    return (restaurantId: string, offset: number, limit: number) => this.findByRestaurantPaginated(restaurantId, offset, limit)
  }
  //checks if the user reviewed on a certain restaurant
  async hasUserReviewed(restaurantId: string, userId: string): Promise<boolean> {
    const {data, error} = await this.supabase
      .from('reviews')
      .select('reviewer_username')
      .eq('resto_name', restaurantId)
      .eq('reviewer_username', userId)

    if(error) {
     throw error;
    }

    return data.length > 0;
  }

  //returns all the ratings of a certain restaurant
  async findRatingsByRestaurant(restaurantId: string) {
    const {data, error} = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('resto_name', restaurantId)

    if(error) {
      throw error
    }

    return data.map(({rating}) => rating)
  }
}
