import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class UserRepository {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  async findById(userId: string) {

  }

  async save(user: any) {

  }
}
