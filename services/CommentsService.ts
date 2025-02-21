import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {CommentProps, CommentEntity} from "../aggregates/entities/Comment";
export class CommentsService {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  //returns comments of a review, limited by the offset and limit
  async findByReviewPaginated(reviewId: string, offset: number, limit: number) {
    const {data, error} = await this.supabase
      .from('comments')
      .select()
      .eq('review_ref', reviewId)
      .range(offset, limit + offset - 1)

    if(error) {
      throw error;
    }

    const comments: CommentEntity[] = []
    for(let i = 0; i < data.length; i++) {
      const commentProps: CommentProps = {
        commentId: data[i].id,
        reviewId: data[i].review_ref,
        username: data[i].username,
        commentContent: data[i].content,
        commentDate: data[i].created_at,
      }

      comments.push(new CommentEntity(commentProps))
    }

    return comments;
  }
}
