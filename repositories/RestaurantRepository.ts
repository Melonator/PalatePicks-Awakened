/*
Repository for retrieving and persisting(saving) a restaurant aggregate
*/

import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {Restaurant, RestaurantProps} from "../aggregates/Restaurant"

export class RestaurantRepository {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns a restaurant aggregate
  async findById(restaurantId: string): Promise<Restaurant> {
    const {data, error} = await this.supabase
      .from('restaurants')
      .select()
      .eq('name', restaurantId)
      .single()

    if(error) {
      throw error
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
  async save(restaurant: any) {

  }
}
