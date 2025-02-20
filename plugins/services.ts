import {UserRepository} from "../repositories/UserRepository";
import {CommentsService} from "../services/CommentsService";
import {HelpfulReviewsService} from "../services/HelpfulReviewsService";
import {ReviewService} from "../services/ReviewService";
import {UserService} from "../services/UserService";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const commentsService = new CommentsService(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  const helpfulReviewsService = new HelpfulReviewsService(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  const reviewService = new ReviewService(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  const userService = new UserService(config.public.supabaseUrl,
    config.public.supabaseAnonKey);
  return {
    provide: {
      commentsService,
      helpfulReviewsService,
      reviewService,
      userService,
    },
  };
});
