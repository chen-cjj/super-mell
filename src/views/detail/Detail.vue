<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @itemClick="itemClick" ref="navBar"/>
    
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <back-top @click.native="topclick" v-show="isShowBackTop" />
    <detail-bottom-bar @addCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import GoodsList from 'components/content/goods/GoodsList'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'

  import {
    getDetail,
    Goods,
    Shop,
    GoodsParam,
    getRecommend
  } from 'network/detail'

  import {
    itemListenerMixin, 
    backTopMixin
  } from 'common/mixin'

  import {
  debounce
} from 'common/utils'

import {mapActions} from 'vuex'

  export default {
    name: 'Detail',
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
    },

    mixins: [itemListenerMixin, backTopMixin],
    
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0,
      }
    },
    destroyed() {   // 不能使用deactivated是因为没有做缓存
      // 取消全局监听
      this.$bus.$off('itemImgLoad' ,this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      // 图片加载完成
      imageLoad() {
        this.refresh()
        // 调用获取y值
        this.getThemeTopYs()
      },
      // 标题点击
      itemClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index] + 44,200)
      },
      // 滑动对应标题的改变
      contentScroll(position) {
        const positionY = -position.y + 44
        for(let i=0;i<this.themeTopYs.length-1;i++) {
          if(this.currentIndex!==i && positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1]){
            this.currentIndex = i
            this.$refs.navBar.currentIndex = this.currentIndex
          }
        }
        // 是否显示backTop
        this.listenShowBackTop(position)
      },
      // 添加到购物车
      addToCart() {
        // 1.获取购物车商品数据
        const product = {}
        product.image = this.topImages[0],
        product.title = this.goods.title,
        product.desc = this.goods.desc,
        product.price = this.goods.realPrice,
        product.iid = this.iid

        // 2.将商品添加到购物车
        // this.$store.dispatch('addCart', product)
        this.addCart(product).then(res => {
          this.$toast.show(res,1000)
        })
      }
    },
    created() {
      // 1.保存存入的iid
      this.iid = this.$route.params.iid,

        // 2.发起请求获取数据
        getDetail(this.iid).then(res => {

          const data = res.result

          // 1.获取轮播图数据
          this.topImages = data.itemInfo.topImages

          // 2.获取goods数据
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          // 3.获取商家信息
          this.shop = new Shop(data.shopInfo)

          // 4.获取图片信息
          this.detailInfo = data.detailInfo

          // 5.获取参数数据
          this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

          // 6.获取评论数据
          if (data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
          }

        })

        // 3.请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })

        // 4. 给getThemeTopY赋值
        this.getThemeTopYs = debounce(()=> {
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)
        })
    },
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
</style>