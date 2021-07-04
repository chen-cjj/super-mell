<template>
  <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="ImgLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
    name: 'HomeSwiper',
    components: {
        Swiper,
        SwiperItem
    },
    props: {
        banners: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
      return {
        isLoad: false
      }
    },
    methods: {
        ImgLoad() {
            if(!this.isLoad) {
                this.$emit('swiperImgLoad')
                this.isLoad = true
            }
        }
    }
}
</script>

<style>

</style>