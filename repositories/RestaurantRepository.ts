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

  }

  //returns a list of restaurants, limited by the offset and limit
  async findManyPaginated(offset: number, limit: number) {

  }

  //saves the restaurant aggregate
  async save(restaurant: any) {

  }
}
