<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" 
    :titles="['流行','新款','精选']" 
    @tabClick="tabClick" ref="tabControl1"
      v-show="isTabFixed" />
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll" 
    :pull-up-load='true'
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImgLoad='swiperImgLoad' />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']"
       @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="topclick" v-show="isShowBackTop" />
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'


  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'


  import {
    getHomeMultdata,
    getHomeGoods
  } from 'network/home'

  import {
    itemListenerMixin,
    backTopMixin
  } from 'common/mixin'

  export default {
    name: 'Home',
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,

      HomeSwiper,
      RecommendView,
      FeatureView
    },
    mixins: [itemListenerMixin, backTopMixin],
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    data() {
      return {
        banners: [], // 轮播图数据
        recommends: [], // 推荐数据
        goods: { // 商品数据
          'pop': {
            page: 0,
            list: []
          },
          'new': {
            page: 0,
            list: []
          },
          'sell': {
            page: 0,
            list: []
          }
        },
        scroll: null,
        currentType: 'pop', // 当前的type
        taboffsetTop: 0, // tab到顶部的距离
        isTabFixed: false,    // 是否显示tabcontrol
        saveY: 0,    // 记录y值
      }
    },
    created() {
      // 1.请求轮播图，推荐数据
      this.getHomeMultdata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },

    activated() {
      console.log(this.saveY);
      this.$refs.scroll.scrollTo(0, this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局监听
      this.$bus.$off('itemImgLoad' ,this.itemImgListener)
    },
    methods: {
      // 数据请求相关方法
      // 1.请求轮播图，推荐数据
      getHomeMultdata() {
        getHomeMultdata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      // 2.请求商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp() // 完成刷新加载更多
        })
      },


      // 事件监听相关方法
      // tabClick点击事件
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      
      // 监听滑动位置
      contentScroll(position) {
        // 监听backTop按钮
        this.listenShowBackTop(position)

        // 监听tabControl
        this.isTabFixed = (-position.y >= this.taboffsetTop)
      },
      // 监听下拉加载
      loadMore() {
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.refresh()
      },
      // 图片加载完成
      swiperImgLoad() {
        this.taboffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }

  .home-nav {
    color: #fff;
    background-color: var(--color-tint);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>