/*
Repository for retrieving and persisting(saving) a restaurant aggregate
*/

import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {Restaurant, RestaurantProps} from "../aggregates/Restaurant"
import {ReviewEntity, ReviewProps} from "../aggregates/entities/Review";

export class RestaurantRepository {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns a restaurant aggregate
  async findById(restaurantId: string): Promise<Restaurant | null> {
    const {data, error} = await this.supabase
      .from('restaurants')
      .select()
      .eq('name', restaurantId)
      .single()

    if(error) {
      return null
    }

    if(!data) {
      return null
    }

    const restaurantProps: RestaurantProps = {
      restaurantId: data.id,
      restaurantName: data.name,
      restaurantHeader: data.imageHeader,
      restaurantDescription: data.description,
      restaurantRating: data.rating,
      restaurantPrice: data.price,
      restaurantGallery: data.gallery,
    }

    return new Restaurant(restaurantProps)
  }

  //returns a list of restaurants, limited by the offset and limit
  async findManyPaginated(offset: number, limit: number): Promise<Restaurant[]> {
    const {data, error} = await this.supabase
      .from('restaurants')
      .select()
      .range(offset, limit)

    const restaurants: Restaurant[] = []

    if(error) {
      throw error
    }

    for(let i = 0; i < data.length; i++) {
      const restaurant = data[i]
      const restaurantProps: RestaurantProps = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantHeader: restaurant.imageHeader,
        restaurantDescription: restaurant.description,
        restaurantRating: restaurant.rating,
        restaurantPrice: restaurant.price,
        restaurantGallery: restaurant.gallery,
      }

      restaurants.push(new Restaurant(restaurantProps))
    }

    return restaurants
  }

  //saves the restaurant aggregate
  async save(restaurant: Restaurant) {
    const newReview = restaurant.getNewReview(this)
    const modifiedReview = restaurant.getModifiedReviews(this)
    if(newReview) {
      await this.addNewReview(newReview)
      if(newReview.fileLocations.length > 0) {
        await this.uploadImages(newReview)
      }
    }
    else if(modifiedReview) {

    }
  }

  private async addNewReview(review: ReviewEntity) {
    try {
      console.log(review)
      const {data, error} = await this.supabase
        .from('reviews')
        .insert(
          {
            review_subject: review.reviewSubject,
            content: review.mainReview,
            rating: review.reviewRating,
            resto_name: review.restaurantName,
            reviewer_username: review.username
          }
        )
      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error);
    }

  }

  private async uploadImages(review: ReviewEntity) {
    let reviewId = '';
    let mediaUrls = [];
    let mediaFiles = [];

    // Get Review ID and Upload Media
    console.log('Getting review ID')
    try {
      const {data, error} = await this.supabase
        .from('reviews')
        .select('review_id')
        .eq('reviewer_username', review.username)
        .eq('resto_name', review.restaurantName)

      // Upload media
      for (let i = 0; i < review.fileLocations.length; i++) {
        const media = review.fileLocations[i]
        // console.log(media);
        const fileExt = media.split('.').pop();
        const fileName = `${i}.${fileExt}`;
        const filePath = `${reviewId}/${fileName}`;


        const {data, error} = await this.supabase.storage
          .from('reviews-gallery')
          .upload(filePath, media, {
            upsert: false,
          })
      }
      console.log('Uploaded media');
      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error);
    }

    // Get URL media files from supabase bucket
    console.log('Getting media file path/s from bucket');

    try {
      const {data, error} = await this.supabase.storage
        .from('reviews-gallery')
        .list(`${reviewId}/`);

      if(error) {
        throw error;
      }

      mediaFiles = data.map((file) => `${reviewId}/${file.name}`);


      try {
        for (let i = 0; i < mediaFiles.length; i++) {
          const media = mediaFiles[i];
          const {data, error} = await this.supabase.storage
            .from('reviews-gallery')
            .getPublicUrl(media);
          console.log(data);
          mediaUrls.push(data.publicUrl);
        }
        if (error) {
          throw error;
        }

      } catch (error) {
        console.log(error);
      }




      // Update review with media URL file path
      console.log('Updating review with media file path');

      try {
        const {data, error} = await this.supabase
          .from('reviews')
          .update(
            {
              review_gallery: mediaUrls,
            }
          )
          .eq('review_id', reviewId)

        console.log('Updated review with media file path')
        if (error) {
          throw error;
        }
      } catch(error) {
        console.log(error);
      }
      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error);
    }
  }
  private async modifyReview(review: ReviewEntity) {
    try {
      console.log(review)
      const {data, error} = await this.supabase
        .from('reviews')
        .update(
          {
            review_subject: review.reviewSubject,
            content: review.mainReview,
            rating: review.reviewRating,
            resto_name: review.restaurantName,
            reviewer_username: review.username
          }
        )
        .eq("review_id", review.reviewId)
      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error);
    }

  }

  private async modifyImages(review: ReviewEntity) {
    let mediaUrls = [];
    let mediaFiles = [];
    let mediaToDelete = [];
    // Delete Media
    try {
      console.log('Deleting media from database');
      const {data, error} = await this.supabase
        .from('reviews')
        .update({
          review_gallery: [],
        })
        .eq('review_id', review.reviewId);


      try {
        const { data, error} = await this.supabase.storage
          .from('reviews-gallery')
          .list(`${review.reviewId}/`);

        if (error) {
          throw error;
        }

        mediaToDelete = data.map((file) => `${review.reviewId}/${file.name}`);
        console.log(mediaToDelete);

      } catch(error) {
        console.log(error);
      }

      // Delete listed media from storage
      try {
        for (let i = 0; i < mediaToDelete.length; i++) {
          const { data, error } = await this.supabase.storage
            .from('reviews-gallery')
            .remove([mediaToDelete[i]]);

          if (error) {
            throw error;
          }
        }
      } catch (error) {
        console.log(error);
      }

      // Delete all media from database
      try {
        const { data, error } = await this.supabase
          .from('reviews')
          .update({
            review_gallery: [],
          })
          .eq('review_id', review.reviewId);

        if (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
      }


      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error.message);
    }


    // Upload Media
    try {
      for (let i = 0; i < review.fileLocations.length; i++) {
        const media = review.fileLocations[i];

        const fileExt = media.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${review.reviewId}/${fileName}`;


        const {data, error} = await this.supabase.storage
          .from('reviews-gallery')
          .upload(filePath, media, {
            upsert: false,
          })
        if (error) {
          throw error;
        }
      }
      console.log('Uploaded media');
    } catch(error) {
      console.log(error);
    }

    // Get URL media files from supabase bucket
    console.log('Getting media file path/s from bucket');

    try {
      const {data, error} = await this.supabase.storage
        .from('reviews-gallery')
        .list(`${review.reviewId}/`);

      mediaFiles = [];
      mediaFiles = data.map((file) => `${review.reviewId}/${file.name}`);


      try {
        for (let i = 0; i < mediaFiles.length; i++) {
          const media = mediaFiles[i];
          const {data, error} = await this.supabase.storage
            .from('reviews-gallery')
            .getPublicUrl(media);
          console.log(data);
          mediaUrls.push(data.publicUrl);
        }
        if (error) {
          throw error;
        }

      } catch (error) {
        console.log(error);
      }

      // Update review with media URL file path
      console.log('Updating review with media file path');

      try {
        const {data, error} = await this.supabase
          .from('reviews')
          .update(
            {
              review_gallery: mediaUrls,
            }
          )
          .eq('review_id', review.reviewId)

        console.log('Updated review with media file path')
        if (error) {
          throw error;
        }
      } catch(error) {
        console.log(error);
      }
      if (error) {
        throw error;
      }
    } catch(error) {
      console.log(error);
    }
  }
}
