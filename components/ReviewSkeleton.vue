<template>
  <div class="review-box flex flex-col bg-green_lightbg p-10 sm:w-[1000px] rounded-3xl">
    <div class="reviewer-info flex flex-col items-center sm:grid sm:grid-cols-2 sm:items-start">
      <div class="overall-userinfo flex flex-col sm:flex-row items-center">
        <div class="reviewer-photo w-[104px] h-[104px] rounded-full mr-3 border-4 border-green">
          <img class="w-full h-full rounded-full object-cover bg-grey animate-pulse"/>
        </div>
        <div class="user-info text-center sm:text-left">
          <div class="user-name text-2xl font-semibold hover:underline bg-grey animate-pulse rounded-lg w-[15rem] h-8 mb-1"></div>
          <div class="username text-sm font-light text-grey hover:underline bg-grey animate-pulse rounded-md w-[5rem] h-5"></div>
          <div class="user-school text-sm font-light text-grey"></div>
        </div>
      </div>
    </div>
    <div class="review-title text-xl sm:text-2xl font-semibold my-3">
      <!-- {{ reviewSubject }} -->
    </div>
    <div class="review-content text-md sm:text-lg font-light">
      <!-- {{ mainReview }} -->
    </div>
    <div class="review-gallery flex flex-wrap md:flex-row mt-8">
      <!-- <div v-for="(media, index) in gallery" :key="index"  class="review-photo h-32 w-32 md:w-[150px] md:h-[150px] mr-6 mb-6 flex">
        <div class="w-full">
          <img v-if="reviewFileTypeChecker(media)" class="w-full h-full object-cover flex mr-3 rounded-3xl cursor-pointer hover:filter hover:brightness-75" :src="media" alt="review photo" @click="toggleMediaView(media)"/>
          <video v-else class="w-full h-full object-cover flex mr-3 rounded-3xl cursor-pointer hover:filter hover:brightness-75" :src="media" alt="review video" no-controls />
        </div>
        <div v-if="!reviewFileTypeChecker(media)" class="video-icon absolute bg-black bg-opacity-30 w-[150px] h-[150px] p-14 cursor-pointer rounded-3xl" @click="toggleMediaView(media)">
          <img class="w-full h-full" src="~/assets/icons/Video.svg" />
        </div>
      </div> -->
    </div>
    <div v-if="false" class="owner-replied mt-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="w-6 h-6 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
      <div class="reply-status">
        <span class="font-light text-grey text-md"> replied to this review!</span>
      </div>
    </div>
    <div class="review-posted-at text-sm font-light text-grey " :class="{ 'mt-4' : !didOwnerReply, 'mt-6': didOwnerReply}">
      Posted at <span class="bg-grey animate-pulse rounded-md w-10 h-5"></span> 
      <span v-if="false" class="italic text-grey">Edited</span>
    </div>
    <div class="review-footer flex flex-col sm:flex-row justify-between align-middle mt-5">
      <div class="found-helpful">
          <div class="helpful-count text-2xl font-semibold bg-grey animate-pulse rounded w-10 h-8 mb-1"></div>
          <div class="helpful-text text-sm font-light text-grey ">found this helpful</div>
      </div>
      <div class="right-buttons flex mt-4 flex-col justify-center md:flex-row md:mt-0 md:justify-around mr-3">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    isRestoOwner: {
      type: Boolean,
    },
    username: {
      type: String
    },
    reviewSubject: {
      type: String
    },
    mainReview: {
      type: String
    },
    rating: {
      type: Number
    },
    date: {
      type: String
    },
    helpfulCount: {
      type: Number
    },
    comments: {
      type: Array
    },
    gallery: {
      type: Array
    },
    loggedUserProfile: {
      type: Object
    },
    restoId: {
      type: String
    },
    reviewId: {
      type: String
    },
    isEdited: {
      type: Boolean
    },
    didOwnerReply: {
      type: Boolean
    }
  },
  data() {
    return{
      markButtonClass: "bg-green text-white rounded-3xl items-center text-sm font-light px-6 py-3 w-full h-12 mt-2 md:mt-0 md:mr-4",
      markedButtonClass: "bg-[#93cfa9] text-white rounded-3xl items-center text-sm font-light px-6 py-3 w-full h-12 mt-2 md:mt-0 md:mr-4",
      unmarkedButtonClass: "bg-green text-white rounded-3xl items-center font-light text-sm px-6 py-3 w-full h-12 mt-2 md:mt-0 md:mr-4",
    }
  },
}
</script>
