<template>
  <div class="chapter page container">

    <h1 class="head">{{ manga.name }} {{ chapter.number }}</h1>
    <button class="action" @click="unselectChapter()">
      <i class="fa fa-times"></i>
    </button>

    <div class="content">
      <swiper ref="slider" class="slider" :options="options" dir="rtl">
        <swiper-slide v-if="prevChapter">

          <div class="slide" dir="ltr">
            Back to previous
            <button class="cta" @click="select(prevChapter.number)">
              chapter {{ prevChapter.number }}
            </button>
          </div>

        </swiper-slide>
        <swiper-slide v-for="(page, i) in pages" :key="i">
          
          <div v-if="images[i]" class="pic">
            <img :src="images[i].src" />
          </div>
          <div class="slide" dir="ltr" v-else-if="images[i] === false">
            Oh no, could not load this image...
          </div>
          <div class="slide" dir="ltr" v-else>
            Loading
          </div>

        </swiper-slide>
        <swiper-slide>
          
          <div class="slide" dir="ltr" v-if="nextChapter">
            Go to next
            <button class="cta" @click="select(prevChapter.number)">
              chapter {{ nextChapter.number }}
            </button>
          </div>
          <div class="slide" dir="ltr" v-else>
            Last chapter reached.
          </div>

        </swiper-slide>
      </swiper>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { loadImage } from '../utils'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data: () => ({
    options: {
      slidesPerView: 'auto'
    },
    preloaded: false,
    images: []
  }),
  computed: {
    ...mapGetters([
      'manga',
      'chapter',
      'pages'
    ]),
    prevChapter() {
      const prev = this.$store.state.currentChapter - 1
      return this.$store.state.chapters[this.$store.state.currentManga]?.find(c => c.number === prev)
    },
    nextChapter() {
      const next = this.$store.state.currentChapter + 1
      return this.$store.state.chapters[this.$store.state.currentManga]?.find(c => c.number === next)
    }
  },
  methods: {
    ...mapActions([
      'selectChapter',
      'unselectChapter'
    ]),
    async preload() {
      this.images = []
      for(let i = 0; i < this.pages.length; i++) {
        try {
          const img = await loadImage(this.pages[i].url)
          console.log(`image ${this.pages[i].url} loaded`)
          this.images.push(img)
        }
        catch(err) {
          console.error(err)
          this.images.push(false)
        }
      }
    },
    async select(n) {
      await this.selectChapter({ slug: this.manga.slug, n })
      this.preload()
      this.$store.dispatch('unload')
      this.$refs.slider.swiper.slideTo(1)
    }
  },
  mounted() {
    this.preload()
    this.$store.dispatch('unload')
    this.$refs.slider.swiper.slideTo(1)
  }
}
</script>

<style lang="scss">
.chapter {

  .swiper-container {
    height: 100%;
  }

  .swiper-slide {
    width: 100vw;

    img {
      width: 100%;
    }
  }

  .slide {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .cta {
      width: 60%;
      margin-top: 20px;
    }
  }

}
</style>