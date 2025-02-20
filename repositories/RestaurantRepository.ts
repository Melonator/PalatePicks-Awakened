/*
Repository for retrieving and persisting(saving) a restaurant aggregate
*/

import { createClient, SupabaseClient } from "@supabase/supabase-js";
export class RestaurantRepository {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns a restaurant aggregate
  async findById(restaurantId: string) {
    const {data, error} = await this.supabase
      .from('restaurants')
      .select()
      .eq('name', restaurantId)
      .single()

    if(error) {
      throw error
    }

    console.log(data)
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
