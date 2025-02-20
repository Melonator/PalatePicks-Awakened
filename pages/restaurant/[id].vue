<template>
  <Preloader v-if="false" :loading="loading" />
  <div class="min-h-screen pb-80">
      <div v-if="loading" class="animate-pulse bg-gradient-to-b w-full">
      </div>
<!--    :class="{-->
<!--    'animate-pulse bg-gray': loading,-->
<!--    'h-[250px] md:h-[586px] min-w-screen flex flex-col pl-4 md:pl-56 md:pr-64 justify-center text-white': !loading-->
<!--    }"-->
    <div
      :style="` background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${Restaurant.imageHeader}); background-size: cover; background-position: center;`"
    >
      <div class="h-[250px] md:h-[586px] min-w-screen flex flex-col pl-4 md:pl-56 md:pr-64 justify-center text-white">
        <!-- Skeleton Loader (Shows when loading is true) -->
        <template v-if="loading">
          <div class="animate-pulse">
            <!-- Title Skeleton -->
            <div class="bg-gray-400 rounded-md w-64 h-8 mb-4"></div>

            <!-- Owner Tag Skeleton -->
            <div v-if="isRestoOwner" class="bg-gray-300 w-56 h-6 rounded-2xl mb-4"></div>

            <!-- Ratings Skeleton -->
            <div class="flex items-center mb-4">
              <div class="bg-gray-400 w-32 h-6 rounded-md"></div>
              <div class="dot text-2xl ml-10">·</div>
              <div class="bg-gray-400 w-16 h-6 rounded-md"></div>
            </div>

            <!-- Description Skeleton -->
            <div class="bg-gray-400 w-full h-6 rounded-md mb-2"></div>
            <div class="bg-gray-400 w-3/4 h-6 rounded-md"></div>
          </div>
        </template>

        <!-- Actual Content (Shows when loading is false) -->
        <template v-else>
          <div class="resto-title font-bold text-3xl md:text-5xl">
            {{ Restaurant.name }}
          </div>

          <div v-if="isRestoOwner" class="text-green text-lg mt-4 bg-white w-56 text-center font-light rounded-2xl p-1">
            RESTAURANT OWNER
          </div>

          <div class="resto-ratings flex mt-3 mr-3">
            <div class="resto-rating text-2xl flex mr-3">
              <img v-for="i in Restaurant.rating" class="star-icon w-25 h-25" src="~/assets/icons/Star.svg" alt="star" :key="i" />
              <img v-for="i in 5 - Restaurant.rating" class="star-icon w-25 h-25" src="~/assets/icons/Star-blank.svg" alt="star" :key="i" />
            </div>
            <div class="dot text-2xl ml-10">·</div>
            <div class="resto-price text-2xl pl-3">
        <span v-for="i in Restaurant.price" class="budget-icon text-xl text-green pr-1" :key="i">
          ₱
        </span>
            </div>
          </div>

          <div class="resto-description md:text-lg font-light mt-3">
            {{ Restaurant.description }}
          </div>
        </template>
      </div>
    </div>
    <div class="body px-4 md:px-20">
      <div class="gallery">
        <div class="gallery-title text-3xl font-semibold mt-20 mb-10">
          <span v-if="isRestoOwner">Your </span>Gallery
        </div>
        <div class="gallery-photos flex overflow-x-auto">
            <div v-for="(media, index) in Restaurant.gallery" :key="index" class="gallery-photo w-80 h-80 md:w-[500px] md:h-[500px] mr-10 mb-10">
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
              <InputReviewBox @update="getReviews" v-if="isReviewBoxOpen" @close="closeReviewBox" :name="restoId"  :isVisible="isReviewBoxOpen" :loggedUserProfile="loggedUserProfile" @preload="togglePreloader" />
              <ReviewBox @update="getReviews" v-if="(restoReviews.length)" v-for="review in restoReviews" :key="review" @refreshRating="getRestaurant" :restoId="restoId" :username="review.reviewer_username" :loggedUserProfile="loggedUserProfile" :isRestoOwner="isRestoOwner" :reviewSubject="review.review_subject" :mainReview="review.content" :rating="review.rating" :date="review.created_at" :helpfulCount="review.helpful_count" :comments="review.comments" :reviewId="review.review_id" :gallery="review.review_gallery" :isEdited="review.is_edited" :didOwnerReply="review.owner_replied"/>
              <div v-else class="no-reviews text-xl font-light text-grey mt-8">
                <span v-if="!isReviewBoxOpen && !isSearchingReview && !isFilteringReview">No reviews yet. Be the first to review this restaurant!</span>
                <span v-else-if="isSearchingReview">No review found matching "{{ this.lastSearchQuery }}".</span>
                <span v-else-if="isFilteringReview">No review found matching the requested filter.</span>
              </div>
              <ReviewSkeleton v-if="loading" v-for="n in 5"/>
            </div>
          </div>
          <div class="review-filters mt-20 flex flex-col w-auto sm:items-end">
            <div class="create-review">
              <div v-if="!hasReviewed || hasReviewed">
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
        this.Restaurant = ref([]);

        const { data, error } = await this.supabase
          .from('restaurants')
          .select()
          .eq('name', useRoute().params.id)
          .maybeSingle();


        if (error) {
          console.log(error)
        }
        if(data){
          this.Restaurant = data;
          this.rating = data.rating
        }

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

        try {
          const { data, error } = await this.supabase
          .from('reviews')
          .select()
          .eq('resto_name', this.restoId)
          .order('created_at', { ascending: false })

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

        if (this.selectedFilter.includes('star')) {
          try {

            starNo = this.starFilter[this.selectedFilter];

            const { data, error } = await this.supabase
            .from('reviews')
            .select()
            .eq('resto_name', this.restoId)
            .eq('rating', starNo)
            .order('created_at', { ascending: false });

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
        } else {
          try {
            const { data, error } = await this.supabase
            .from('reviews')
            .select()
            .eq('resto_name', this.restoId)
            .order(this.filters[this.selectedFilter][0], { ascending: this.filters[this.selectedFilter][1] });

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
          Restaurant: {},
          rating: 0,
          loading: true,
          hasReviewed: false,
          filters: {'new-to-old': ['created_at', false], 'old-to-new': ['created_at', true], 'most-helpful': ['helpful_count', false]},
          starFilter: {'five-stars': 5, 'four-stars': 4, 'three-stars': 3, 'two-stars': 2, 'one-star': 1},
          start: 5,
          end: 9,
          loadedAllReviews: false,
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
    async mounted(){
      await this.getRestaurant()
      await this.getReviews()
      await this.didUserReview()
      // If no restaurant object is found (no keys)
      if(Object.keys(this.Restaurant).length === 0){
        throw createError({ statusCode: 404, statusMessage: 'Restaurant not found...', fatal: true})
      } else {

        // Checks if current logged in user is restaurant owner
        if(this.loggedUserProfile.length){
          if(this.Restaurant.owner === this.loggedUserProfile[0].username){
            this.isRestoOwner = true
          }
        }
      }
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
