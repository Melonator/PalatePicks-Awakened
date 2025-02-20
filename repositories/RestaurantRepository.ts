/*
Repository for retrieving and persisting(saving) a restaurant aggregate
*/

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { RestaurantProps, Restaurant } from "../aggregates/Restaurant"

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

    const restaurant = new Restaurant(restaurantProps)
    return restaurant
  }

  //returns a list of restaurants, limited by the offset and limit
  async findManyPaginated(offset: number, limit: number) {
    const {data, error} = await this.supabase
      .from('restaurants')
      .select()
      .range(offset, limit)

    if(error) {
      throw error
    }

    console.log(data)
  }

  //saves the restaurant aggregate
  async save(restaurant: any) {

  }
}
