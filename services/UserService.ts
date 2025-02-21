import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {UserDTO} from "../DTO/UserDTO";

export class UserService {
  //TODO: Return a UserDTO Object
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

    const userDTO: UserDTO = {
      profileId: data.id,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      profileImgSrc: data.profile_img_src,
      email: data.email,
      bio: data.bio,
      school: data.school,
      dateJoined: data.created_at
    }

    return userDTO
  }
}
