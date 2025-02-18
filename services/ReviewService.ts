class ReviewService {
  //returns all reviews made by a user
  static findByUser(userId: string) {

  }

  //returns reviews of a restaurant, limited by the offset and limit
  static findByRestaurantPaginated(restaurantId: string, offset: number, limit: number) {

  }

  //checks if the user reviewed on a certain restaurant
  static hasUserReviewed(restaurantId: string, userId: string): boolean {
    return false;
  }

  //returns all the ratings of a certain restaurant
  static findRatingsByRestaurant(restaurantId: string) {

  }
}
