import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class HelpfulReviewsService {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  async hasUserUpvoted(reviewId: string, userId: string) {
    const {data, error} = await this.supabase
      .from('reviews')
      .select('users_liked')
      .eq('review_id', reviewId)


    if(error) {
      throw error
    }

    console.log(data)
    return data.users_liked.some(user => user as unknown as string === userId)
  }
}
