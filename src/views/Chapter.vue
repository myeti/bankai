<template>
  <div class="chapter page container">

    <h1 class="head">{{ manga.name }} #{{ chapter.number }}</h1>
    <button class="action" @click="unselectChapter()">
      <i class="fa fa-times"></i>
    </button>

    <div class="content" ref="content">
      <swiper ref="slider" class="slider" :options="options" dir="rtl" @slideChange="onSlide">
        <swiper-slide v-if="prevChapter">

          <div class="slide" dir="ltr">
            <button class="cta" @click="select(prevChapter.number)">
              PREV CHAPTER {{ prevChapter.number }}
            </button>
          </div>

        </swiper-slide>
        <swiper-slide v-for="(page, i) in chapter.pages" :key="i"
                      :class="{ 'swiper-no-swiping': zoom }">
          
          <div v-if="images[i]" class="pic" :class="{ zoom }" @dblclick="toggleZoom">
            <img :src="images[i].src" :style="{ height: zoom || 'auto' }" />
          </div>
          <div class="slide" dir="ltr" v-else-if="images[i] === false">
            Oh no, could not load this image...
          </div>
          <div class="slide" dir="ltr" v-else>
            <div class="spinner"></div>
          </div>

        </swiper-slide>
        <swiper-slide>
          
          <div class="slide" dir="ltr" v-if="nextChapter">
            <button class="cta" @click="select(nextChapter.number)">
              NEXT CHAPTER {{ nextChapter.number }}
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { loadImage } from '../utils'

export default {
  components: {
    swiper,
    swiperSlide
  },
  data: () => ({
    options: {
      slidesPerView: 'auto',
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      }
    },
    preloaded: false,
    images: [],
    zoom: false
  }),
  computed: {
    ...mapGetters([
      'manga',
      'chapter',
      'meta'
    ]),
    prevChapter() {
      const prev = this.$store.state.current.chapter - 1
      return this.manga.chapters.find(c => c.number === prev)
    },
    nextChapter() {
      const next = this.$store.state.current.chapter + 1
      return this.manga.chapters.find(c => c.number === next)
    }
  },
  methods: {
    ...mapActions([
      'selectChapter',
      'unselectChapter'
    ]),
    async preload() {
      this.images = []
      for(let i = 0; i < this.chapter.pages.length; i++) {
        try {
          const img = await loadImage(this.chapter.pages[i].url)
          console.log(`image ${this.chapter.pages[i].url} loaded`)
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
      this.$refs.slider.swiper.slideTo(1)
      this.$store.dispatch('unload')
    },
    toggleZoom() {
      this.zoom = this.zoom ? false : this.$refs.content.offsetHeight + 'px'
    },
    onSlide() {
      this.zoom = false
    }
  },
  mounted() {
    console.log('Chapter.mounted')
    this.preload()
    this.$store.dispatch('unload')
    this.$refs.slider.swiper.slideTo(1)
  }
}
</script>

<style lang="scss">
@import '../assets/scss/vars';

.chapter {

  .swiper-container {
    height: 100%;
  }

  .swiper-slide {
    width: 100vw;
    overflow: auto;
  }

  .pic {
    min-height: 100%;
    text-align: center;

    img {
      width: 100%;
    }
    &.zoom img {
      width: auto;
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

    .spinner {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      border: 2px solid $border-color;
      border-top-color: transparent;
      border-bottom-color: transparent;
      animation: spinning 1s ease-in-out infinite;
    }
  }

}

@keyframes spinning {
  from { transform: rotate(0deg) }
  to { transform: rotate(180deg) }
}
</style>