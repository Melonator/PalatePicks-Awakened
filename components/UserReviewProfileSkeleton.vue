<script setup lang="ts">

</script>

<template>
  <div class="review-box flex flex-col bg-green_lightbg p-10 w-[1000px] rounded-3xl">
    <div class="review-info flex flex-col items-start">
      <div class="restaurant name text-3xl bg-grey rounded-2xl animate-pulse h-8 w-72 font-bold hover:underline cursor-pointer">
<!--        <NuxtLink :to="`/restaurant/${restoName}`">{{ restoName }}</NuxtLink>-->
      </div>
      <div class="reviewer-rating text-xl flex bg-grey animate-pulse h-6 w-64 rounded-2xl pr-3 mt-2 mb-4">
      </div>
    </div>
    <div class="review-title text-2xl font-semibold bg-grey animate-pulse h-6 w-96 rounded-2xl my-3">
<!--      {{ reviewSubject }}-->
    </div>
    <div class="review-content text-lg font-light bg-grey animate-pulse h-6 w-full mb-2 rounded-2xl">
    </div>
    <div class="review-content text-lg font-light bg-grey animate-pulse h-6 w-full mb-2 rounded-2xl">
    </div>
    <div class="review-content text-lg font-light bg-grey animate-pulse h-6 w-full rounded-2xl">
    </div>
    <div class="review-gallery flex mt-8">
      <div class="review-photo w-[150px] h-[150px] bg-grey animate-pulse rounded-2xl mr-6 mb-6 flex"></div>
      <div class="review-photo w-[150px] h-[150px] bg-grey animate-pulse rounded-2xl mr-6 mb-6 flex"></div>
      <div class="review-photo w-[150px] h-[150px] bg-grey animate-pulse rounded-2xl mr-6 mb-6 flex"></div>
    </div>
    <div class="review-posted-at text-sm font-light text-grey mt-4">
    </div>
    <div class="review-footer flex justify-between align-middle mt-5">
      <div class="found-helpful">
        <div class="helpful-count text-2xl font-semibold"></div>
        <div class="helpful-text text-sm font-light text-grey"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
