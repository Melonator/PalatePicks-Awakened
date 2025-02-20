import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class HelpfulReviewsService {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns all reviews (only the id) marked as helpful by the user
  async findByUser(userId: string) {

  }
}
