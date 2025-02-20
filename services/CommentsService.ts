import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class CommentsService {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns comments of a review, limited by the offset and limit
  async findByReviewPaginated(reviewId: string, offset: number, limit: number) {

  }
}
