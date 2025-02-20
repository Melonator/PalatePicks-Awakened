class ReviewService {
  //returns all reviews made by a user
  async findByUser(userId: string) {

  }

  //returns reviews of a restaurant, limited by the offset and limit
  async findByRestaurantPaginated(restaurantId: string, offset: number, limit: number) {

  }

  //checks if the user reviewed on a certain restaurant
  async hasUserReviewed(restaurantId: string, userId: string): Promise<boolean> {
    return false;
  }

  //returns all the ratings of a certain restaurant
  async findRatingsByRestaurant(restaurantId: string) {

  }
}
