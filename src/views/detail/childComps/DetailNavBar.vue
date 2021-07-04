<template>
  <div>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt="">
      </div>
      <div slot="center" class="title">
        <div class="item-title" 
             v-for="(item,index) in titles" :key="index" 
             :class="{active: currentIndex === index}"
             @click="itemClick(index)" >{{item}}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  export default {
    name: 'DetailNavBar',
    data() {
      return {
        titles: ['商品', '参数', '评论', '推荐'],
        currentIndex: 0
      }
    },
    components: {
      NavBar
    },
    methods: {
      backClick() {
        this.$router.back()
      },
      itemClick(index) {
          this.currentIndex = index
          this.$emit('itemClick',index)
      }
    }
  }
</script>

<style scoped>
  .back {

    margin-top: 6px;
    margin-left: 12px;
  }

  .back img {
    height: 20px;
    width: 20px;
  }

  .title {
    display: flex;
  }

  .item-title {
    flex: 1;
    font-size: 13px;
  }

  .active {
    color: var(--color-high-text);
  }
</style>