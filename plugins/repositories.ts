import {RestaurantRepository} from '../repositories/RestaurantRepository'
import {UserRepository} from "../repositories/UserRepository";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const restaurantRepository = new RestaurantRepository(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  const userRepository = new UserRepository(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  return {
    provide: {
      restaurantRepository,
      userRepository,
    },
  };
});
