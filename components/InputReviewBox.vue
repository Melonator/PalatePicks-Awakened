<template>
  <div v-if="isVisible" class="input-reviewbox flex flex-col bg-green_lightbg w-full p-10 md:w-[1000px] rounded-3xl shadow-xl shadow-green">
    <h2 class="rate-title font-semibold text-3xl">Create a Review</h2>
    <div class=" font-light text-grey text-lg">You're now reviewing {{ name }}</div>
    <form>
      <div class="rate-stars flex flex-col md:flex-row pr-3 pt-5 md:items-center">
        <div class="flex flex-row">
          <img class="h-10 w-10 cursor-pointer" v-for="(star, index) in stars" :key="index" @click="toggleRating(index + 1)" :src="getStarIcon(index)" :alt="getStarAlt(index)" @click.prevent />
        </div>
        <div class="rate-meaning ml-1 md:ml-4">
          <div v-if="selectedRating === 0" class="text-sm font-light text-grey">Select your rating</div>
          <div v-if="selectedRating === 1" class="text-sm font-light text-grey">Poor</div>
          <div v-if="selectedRating === 2" class="text-sm font-light text-grey">Fair</div>
          <div v-if="selectedRating === 3" class="text-sm font-light text-grey">Good</div>
          <div v-if="selectedRating === 4" class="text-sm font-light text-grey">Very Good</div>
          <div v-if="selectedRating === 5" class="text-sm font-light text-grey">Excellent</div>
        </div>
      </div>
      <div class="review-part flex flex-col md:flex-row pt-8">
        <div class="reviewer-photo w-20 h-20 invisible md:visible rounded-full mr-3 border-4 border-green">
            <img class="w-full h-full rounded-full object-cover" :src="loggedUserProfile[0].profile_img_src" alt="user" />
        </div>
        <div class="review-content flex flex-col gap-5 mt-1">
          <div class="review-title">
            <input class="review-title-input w-full md:w-[600px] h-14 rounded-2xl px-6 border-1 focus:outline-green" v-model="reviewTitle" type="text" placeholder="Review Title" maxlength="50" :class="{'focus:outline-red' : reviewTitle.length === 50}" />
            <div v-show="reviewTitle.length === 50" class="text-xs mt-2 ml-1 text-red">Maximum of 50 characters only</div>
          </div>
          <div class="review-text">
            <textarea class="review-text-input w-full md:w-[800px] h-[200px] rounded-2xl px-6 py-3 border-1 focus:outline-green" v-model="reviewContent" type="text" placeholder="Review Description" maxlength="500" :class="{'focus:outline-red' : reviewContent.length === 500}" />
            <div v-show="reviewContent.length === 500" class="text-xs mt-2 ml-1 text-red">Maximum of 500 characters only</div>
          </div>
          <div class="review-gallery flex flex-wrap md:flex-row">
            <div v-for="(media, index) in mediaItems" :key="index" class="media-items flex items-center justify-center w-[90px] h-[90px] mr-2 md:mr-6 mb-6 cursor-pointer" @mouseover="media.hovered = true" @mouseleave="media.hovered = false">
              <img v-if="media.isImage" class="w-full h-full object-cover rounded-3xl border-2 border-grey" :src="media.url" :alt="'Media Item ' + (index + 1)" />
              <video v-else class="w-full h-full object-cover rounded-3xl border-2 border-grey" :src="media.url" :alt="'Media Item ' + (index + 1)" no-controls />
              <div v-if="media.isVideo && !media.hovered" class="video-icon absolute bg-black bg-opacity-30 w-[90px] h-[90px] p-8 rounded-3xl">
                <img class="w-full h-full" src="~/assets/icons/Video.svg" />
              </div>
              <div v-if="media.hovered" class="absolute bg-black bg-opacity-30 w-[90px] h-[90px] p-8 rounded-3xl" @click="removeMedia(index)">
                <img class="w-full h-full" src="~/assets/icons/Trash.svg" />
              </div>
            </div>
            <div class="add-media flex flex-col items-center justify-center w-[90px] h-[90px] p-4 mr-6 mb-6 rounded-3xl border-2 border-grey cursor-pointer">
              <img v-if="mediaItems.length < 5" src="~/assets/images/camera-icon.png" alt="camera icon" @click="openFileInput"/>
              <div class=" text-xs"> {{ mediaItems.length }} / 5</div>
              <input ref="fileInput" type="file" accept="image/*, video/*" class="block" @change="handleFileUpload" />
            </div>
          </div>
          <div class="review-buttons flex flex-col justify-center md:flex-row md:justify-end">
            <button class="bg-white text-green rounded-3xl flex items-center justify-center font-light px-14 w-full md:w-40 py-3 mr-4" @click="closeReviewBox">
              Cancel
            </button>
            <button v-if="selectedRating > 0 && reviewTitle !== '' && reviewContent !== ''" class="bg-green text-white rounded-3xl flex items-center justify-center font-light px-6 w-full mt-4 md:mt-0 md:w-40 py-3 mr-4" @click="handleSubmit($event)">
              Submit Review
            </button>
            <button v-else class="bg-[#93cfa9] text-white rounded-3xl flex items-center justify-center font-light w-full mt-4 md:mt-0 md:w-40 px-6 py-3 mr-4" disabled>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import StarIcon from '~/assets/icons/Star.svg'
import StarBlankIcon from '~/assets/icons/Star-blank.svg'

export default {
  props: {
    name: {
      type: String,
      default: 'Resto Name',
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
    loggedUserProfile: {
      type: Object,
    },
  },
  data() {
    return {
      supabase: useSupabaseClient(),
      stars: [1, 2, 3, 4, 5],
      starIcon: StarIcon,
      starBlankIcon: StarBlankIcon,
      mediaItems: [],
      openInputReviewBox: true,

      reviewTitle: '',
      reviewContent: '',
      selectedRating: 0,
      fileLocs: [],
    };
  },
  methods: {
    toggleRating(starCount) {
      if (this.selectedRating === starCount) {
        this.selectedRating = 0;
      } else {
        this.selectedRating = starCount;
      }
    },
    getStarIcon(index) {
      return this.selectedRating >= index + 1 ? this.starIcon : this.starBlankIcon;
    },
    getStarAlt(index) {
      return this.selectedRating >= index + 1 ? "Filled Star" : "Outline Star";
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        this.fileLocs.push(file);

        this.mediaItems.push ({
          url: URL.createObjectURL(file),
          hovered: false,
          isImage,
          isVideo,
          label: isImage ? 'Image' : isVideo ? 'Video' : 'Unknown'
        });
      }
    },
    removeMedia(index) {
      this.mediaItems.splice(index, 1);
      this.fileLocs.splice(index, 1);
    },
    closeReviewBox() {
      this.$emit('close');
    },

    async handleSubmit(event) {
      event.preventDefault();
      const reviewData = {
        reviewSubject: this.reviewTitle,
        content: this.reviewContent,
        rating: this.selectedRating,
        restaurantName: this.name,
        reviewerUsername: this.loggedUserProfile[0].username,
        fileLocations: this.fileLocs
      }

      this.$emit('submit', reviewData);
    },
  },
}
</script>

<style scoped>
</style>


