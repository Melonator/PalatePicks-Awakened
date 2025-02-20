import {createClient, SupabaseClient} from "@supabase/supabase-js";

export class UserService {
  //TODO: Return a UserDTO Object
  private supabase: SupabaseClient<any, "public", any>
  constructor (supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  async findById(userId: string) {

  }
}
