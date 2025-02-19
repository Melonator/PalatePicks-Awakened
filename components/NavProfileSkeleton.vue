<template>
  <div class="nav-user-profile container mx-auto">
    <div class="relative">
      <div
        :class="['center', 'bg-green_light', 'px-4', 'py-2', { 'rounded-3xl': !rounded, 'rounded-t-3xl': rounded }, 'flex', { 'active': isDropdownOpen }]"
      >
        <img class="center w-6 h-6 rounded-full mr-3 object-center object-cover bg-grey animate-pulse"/>
        <span class=" w-14 h-6 bg-grey animate-pulse rounded-xl object-center object-cover"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style scoped>
.nav-user-profile {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  display: none;
  padding-bottom: 10px;
}

.menu-item {
  display: block;
  padding-top: 3px;
  padding-bottom: 3px;
}

.dropdown-menu.show {
  display: block;
}

.dropdown-button {
  cursor: pointer;
}

</style>
