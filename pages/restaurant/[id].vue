<template>
  <Preloader v-if="loading" :loading="loading" />
  <div class="min-h-screen pb-80">
    <div class="h-[250px] md:h-[586px] min-w-screen flex flex-col pl-4 md:pl-56 md:pr-64 justify-center text-white" :style="`background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${restaurant.restaurantHeader}); background-size: cover; background-position: center;`">
      <div class="resto-title font-bold text-3xl md:text-5xl">
        {{ restaurant.restaurantName }}
      </div>
      <div v-if="isRestoOwner" class="text-green text-lg mt-4 bg-white w-56 text-center font-light rounded-2xl p-1">
        RESTAURANT OWNER
      </div>
      <div class="resto-ratings flex mt-3">
        <div class="resto-rating text-2xl flex pr-3">
          <img v-for="i in restaurant.restaurantRating" class="star-icon w-25 h-25" src="~/assets/icons/Star.svg" alt="star" :key="i" />
         <img v-for="i in 5 - rating" class="star-icon w-25 h-25" src="~/assets/icons/Star-blank.svg" alt="star" :key="i" />

        </div>
        <div class="dot text-2xl pr-3">
          ·
        </div>
        <div class="resto-price text-2xl">
          <span v-for="i in restaurant.restaurantPrice" class="budget-icon text-xl text-green pr-1" :key="i">
            ₱
          </span>
        </div>
      </div>
      <div class="resto-description md:text-lg font-light mt-3">
        {{ restaurant.restaurantDescription}}
      </div>
    </div>
    <div class="body px-4 md:px-20">
      <div class="gallery">
        <div class="gallery-title text-3xl font-semibold mt-20 mb-10">
          <span v-if="isRestoOwner">Your </span>Gallery
        </div>
        <div class="gallery-photos flex overflow-x-auto">
            <div v-for="(media, index) in restaurant.restaurantGallery" :key="index" class="gallery-photo w-80 h-80 md:w-[500px] md:h-[500px] mr-10 mb-10">
              <img v-if="reviewFileTypeChecker(media)" class="min-w-[500px] h-full object-cover mr-3 rounded-3xl cursor-pointer hover:filter hover:brightness-75" :src="media" alt="review photo" @click="toggleMediaView(media)"/>
              <video v-else class="min-w-[500px] h-full object-cover flex mr-3 rounded-3xl cursor-pointer hover:filter hover:brightness-75" :src="media" alt="review video" no-controls />
              <div v-if="!reviewFileTypeChecker(media)" class="video-icon absolute bg-black bg-opacity-30 w-[150px] h-[150px] p-14 rounded-3xl" @click="toggleMediaView(media)">
                <img class="w-full h-full" src="~/assets/icons/Video.svg" />
              </div>
              <div v-if="showMediaView" @close="closeMediaView">
                <ViewMedia @close="closeMediaView" :media="selectedMedia" :isImage="isImage" />
              </div>
          </div>
        </div>
        <div class="reviews flex flex-col-reverse md:flex-row justify-between">
          <div class="left-portion">
            <div class="reviews-title text-3xl font-semibold mt-20 mb-10">
              <span v-if="isRestoOwner">Your Restaurant's </span> Reviews
            </div>
            <div class="reviews-list flex flex-col gap-8">
              <InputReviewBox @update="getReviews" v-if="isReviewBoxOpen" @close="closeReviewBox" :name="restoId"  :isVisible="isReviewBoxOpen" :loggedUserProfile="loggedUserProfile" @preload="togglePreloader" @submit="addReview"/>
              <ReviewBox @update="getReviews" v-if="(restaurant)" v-for="review in restoReviews" :key="review.reviewId" @refreshRating="getRestaurant" :restoId="restoId" :username="review.username" :loggedUserProfile="loggedUserProfile" :isRestoOwner="isRestoOwner" :reviewSubject="review.reviewSubject" :mainReview="review.mainReview" :rating="review.reviewRating" :date="review.reviewDate" :helpfulCount="review.helpfulCount" :comments="review.comments" :reviewId="review.reviewId" :gallery="review.gallery" :isEdited="review.isEdited" :didOwnerReply="review.ownerReplied"/>
              <div v-else class="no-reviews text-xl font-light text-grey mt-8">
                <span v-if="!isReviewBoxOpen && !isSearchingReview && !isFilteringReview">No reviews yet. Be the first to review this restaurant!</span>
                <span v-else-if="isSearchingReview">No review found matching "{{ this.lastSearchQuery }}".</span>
                <span v-else-if="isFilteringReview">No review found matching the requested filter.</span>
              </div>
            </div>
          </div>
          <div class="review-filters mt-20 flex flex-col w-auto sm:items-end">
            <div class="create-review">
              <div v-if="!hasReviewed">
                <button v-if="!isRestoOwner" :disabled="isReviewBoxOpen" :isVisible="isReviewBoxOpen" @click="openReviewBox" class="bg-green text-white rounded-3xl flex justify-center items-center w-full font-light px-6 py-3 mr-4">
                  <span class="text-white text-base uppercase mr-6">Make a review</span>
                  <img src="~/assets/icons/Plus.svg" />
                </button>
              </div>
            </div>
            <div class="filter-area flex flex-col mt-20">
              <div class="filter-title text-3xl font-semibold font mb-6">
                Filter Reviews
              </div>
              <div class="search-review">
                <input class="search-review-input w-full h-[50px] rounded-3xl pl-6 pr-16 border-2 focus:outline-green" v-model="searchQuery" type="text" placeholder="Search reviews" @keyup.enter="searchReview" required/>
              </div>
              <div class="filter flex flex-row items-center align-middle mt-5 border-t-2 pt-4 border-grey">
                <select ref="filterOptions" class="filter-select w-full h-[50px] text-black rounded-3xl pl-6 pr-16 border-2 focus:outline-green appearance-none" v-model="selectedFilter" @change="filterReviews">
                  <option value="" disabled selected>Filter by</option>
                  <option value="new-to-old">New to Old Reviews</option>
                  <option value="old-to-new">Old to New Reviews</option>
                  <option value="most-helpful">Most Helpful</option>
                  <option value="five-stars">5 Star Ratings</option>
                  <option value="four-stars">4 Star Ratings</option>
                  <option value="three-stars">3 Star Ratings</option>
                  <option value="two-stars">2 Star Ratings</option>
                  <option value="one-star">1 Star Ratings</option>
                </select>
              </div>
              <div class="reset-filters">
                <button class="back-button bg-green text-white rounded-3xl text-center w-full font-light my-5 h-[45px]" @click="getReviews">
                  RESET FILTERS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {Restaurant} from "../../aggregates/Restaurant";

  export default {
    setup() {
      useSeoMeta({
        title: `${useRoute().params.id} | PalatePicks`,
        ogTitle: `${useRoute().params.id} | PalatePicks`,
        description: `View ${useRoute().params.id}'s reviews on PalatePicks`,
        ogDescription: `View ${useRoute().params.id}'s reviews on PalatePicks`,
        image: 'https://i.imgur.com/14qTVqA.png',
        ogImage: 'https://i.imgur.com/14qTVqA.png',
        url: `https://palatepicks.vercel.app/resturant/${useRoute().params.id}`,
        keywords: 'food, restaurant, review, food review, restaurant review, foodie, foodie review, foodie restaurant review, foodie review, foodie restaurant review, foodie restaurant, foodie restaurant review, foodie restaurant review',
      })
    },

    props: {
      session: Object,
      loggedInUser: String,
      loggedUserProfile: Array
    },
    emits: ['retrieveSession'],
    methods: {
      openReviewBox() {
        if (!this.loggedUserProfile.length) {
          this.$router.push('/login')
        } else {
          this.isReviewBoxOpen = true
        }
      },
      closeReviewBox() {
        this.isReviewBoxOpen = false
      },
      closeMediaView() {
        this.showMediaView = false;
      },
      toggleMediaView(media) {
        this.showMediaView = true;
        this.selectedMedia = media;
        if (this.reviewFileTypeChecker(media)) {
          this.isImage = true;
        } else {
          this.isImage = false;
        }
      },
      togglePreloader() {
        this.loading = !this.loading;
      },
      async getRestaurant(){
        this.loading = true;
        this.restaurant = ref([]);

        const {$restaurantRepository} = useNuxtApp();
        this.restaurant = await $restaurantRepository.findById(this.restoId);
        // If no restaurant object is found (no keys)
        if(!this.restaurant){
          throw createError({ statusCode: 404, statusMessage: 'Restaurant not found...', fatal: true})
        } else {
          // Checks if current logged-in user is restaurant owner
          if(this.loggedUserProfile.length){
            if(this.restaurant.owner === this.loggedUserProfile[0].username){
              this.isRestoOwner = true
            }
          }
        }
        this.rating = this.restaurant.restaurantRating;
        this.loading = false;
      },
      reviewFileTypeChecker(file) {
        return file.includes('jpg') || file.includes('png') || file.includes('jpeg') || file.includes('gif');
      },
      async getReviews() {
        this.loading = true;
        this.restoReviews = ref([]);
        this.isSearchingReview = false;
        this.isFilteringReview = false;
        this.lastSearchQuery = '';
        this.searchQuery = '';
        this.selectedFilter = '';

        const {$reviewService} = useNuxtApp();
        this.restaurant.loadReviewService($reviewService);
        await this.restaurant.loadReviews();
        this.restoReviews.push(...this.restaurant.getReviews());

        this.loading = false;
      },
      async searchReview() {
        this.loading = true;
        this.isSearchingReview = true;
        this.restoReviews = ref([]);
        this.lastSearchQuery = this.searchQuery;
        this.isFilteringReview = false;
        this.selectedFilter = '';

        try {
          const { data, error } = await this.supabase
          .from('reviews')
          .select()
          .eq('resto_name', this.restoId)
          .ilike('content', `%${this.searchQuery}%`);

          if (data) {
            this.restoReviews = data;
          }

          if (error) {
            throw error
          }
        } catch(error) {
          console.log(error)
        } finally {
          this.loading = false;
        }
      },
      async filterReviews() {
        this.loading = true;
        this.isFilteringReview = true;
        this.restoReviews = ref([]);
        var starNo = 0;


        if (this.selectedFilter === 'five-stars' || this.selectedFilter === 'four-stars' || this.selectedFilter === 'three-stars' || this.selectedFilter === 'two-stars' || this.selectedFilter === 'one-star') {
          try {

            if (this.selectedFilter === 'five-stars') {
              starNo = 5;
            } else if (this.selectedFilter === 'four-stars') {
              starNo = 4;
            } else if (this.selectedFilter === 'three-stars') {
              starNo = 3;
            } else if (this.selectedFilter === 'two-stars') {
              starNo = 2;
            } else if (this.selectedFilter === 'one-star') {
              starNo = 1;
            }

            const { data, error } = await this.supabase
            .from('reviews')
            .select()
            .eq('resto_name', this.restoId)
            .eq('rating', starNo);

            if (data) {
              this.restoReviews = data;
            }

            if (error) {
              throw error
            }
          } catch(error) {
            console.log(error)
          } finally {
            this.loading = false;
          }
        } else if (this.selectedFilter === 'most-helpful') {
          try {
            const { data, error } = await this.supabase
            .from('reviews')
            .select()
            .eq('resto_name', this.restoId)
            .order('helpful_count', { ascending: false });

            if (data) {
              this.restoReviews = data;
            }

            if (error) {
              throw error
            }
          } catch(error) {
            console.log(error)
          } finally {
            this.loading = false;
          }

        }
        else {
          try {
            const { data, error } = await this.supabase
            .from('reviews')
            .select()
            .eq('resto_name', this.restoId)
            .order('created_at', { ascending: this.selectedFilter === 'old-to-new' })
            .order('created_at', { ascending: this.selectedFilter === 'new-to-old' })

            if (data) {
              this.restoReviews = data;
            }

            if (error) {
              throw error
            }
          } catch(error) {
            console.log(error)
          } finally {
            this.loading = false;
          }
        }
      },
      async didUserReview() {
        this.loading = true;
        this.hasReviewed = false;

        try {
          if(this.loggedUserProfile.length){
            const { data, error } = await this.supabase
              .from('reviews')
              .select()
              .eq('resto_name', this.restoId)
              .eq('reviewer_username', this.loggedUserProfile[0].username);

              if (data.length > 0) {
                this.hasReviewed = true;
              }

              if (error) {
                throw error
              }
          }

        } catch(error) {
          console.log(error)
        } finally {
          this.loading = false;
        }
      },
      async addReview(reviewData) {
        this.restaurant.addNewReview({
          fileLocations: reviewData.fileLocations,
          username: reviewData.reviewerUsername,
          reviewSubject: reviewData.reviewSubject,
          mainReview: reviewData.content,
          reviewRating: reviewData.rating,
        })
        if(reviewData.fileLocations.length > 0){
          this.restaurant.setFileLocationsNewReview(reviewData.fileLocations)
        }
        const {$restaurantRepository} = useNuxtApp();
        await $restaurantRepository.save(this.restaurant)
      },
      async modifyReview(reviewData) {
        this.restaurant.addModifiedReview({
          fileLocations: reviewData.fileLocations,
          username: reviewData.reviewerUsername,
          reviewSubject: reviewData.reviewSubject,
          mainReview: reviewData.content,
          reviewRating: reviewData.rating,
        })
        if(reviewData.fileLocations.length > 0){
          this.restaurant.setFileLocationsModifiedReview(reviewData.fileLocations)
        }
        const {$restaurantRepository} = useNuxtApp();
        await $restaurantRepository.save(this.restaurant)
      }
    },
    data() {
      return {
          supabase: useSupabaseClient(),
          restoId: useRoute().params.id,
          isReviewBoxOpen: false,
          isRestoOwner: false,
          showMediaView: false,
          selectedMedia: '',
          restoReviews: {},
          restaurant: {
            type: Restaurant | null,
            default: null,
          },
          rating: 0,
          loading: true,
          hasReviewed: false,

          searchQuery: '',
          lastSearchQuery: '',
          selectedFilter: '',
          isSearchingReview: false,
          isFilteringReview: false,
          didOwnerReply: false,
      }
    },
    computed: {

    },
    async created(){
      await this.getRestaurant()
      await this.getReviews()
      await this.didUserReview()

    }
  }
</script>

<style scoped>
  .cover-page {
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    background-size: cover;
    background-position: center;
  }
</style>
