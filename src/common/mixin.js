import {
  debounce
} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 1.图片加载完成的事件监听
    this.refresh = debounce(this.$refs.scroll.refresh, 100)
    
    this.itemImgListener = () => {
        this.refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },

}


export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false, // 是否展示BackTop
    }
  },
  components: {
    BackTop
  },
  methods: {
    // 返回顶部
    topclick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    // 是否显示backTop
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}