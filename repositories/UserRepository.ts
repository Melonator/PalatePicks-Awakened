import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class UserRepository {
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  async findById(userId: string) {
    const {data, error} = await this.supabase
      .from('profiles')
      .select()
      .eq('username', userId)
      .single()

    if(error) {
      throw error
    }

    console.log(data)
  }

  async save(user: any) {

  }
}
