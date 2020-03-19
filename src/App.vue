<template>
  <div id="app">

    <transition name="fade">
      <Loading v-if="loading" />
    </transition>

    <Home />

    <transition name="fade-right">
      <Manga v-if="currentSlug" />
    </transition>

    <transition name="fade-right">
      <Chapter v-if="currentSlug && currentNumber !== false" />
    </transition>

  </div>
</template>


<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Loading from './components/Loading'
import Home from './views/Home'
import Manga from './views/Manga'
import Chapter from './views/Chapter'

export default {
  components: {
    Loading,
    Home,
    Manga,
    Chapter
  },
  computed: {
    ...mapState([
      'loading',
      'currentSlug',
      'currentNumber'
    ])
  },
  methods: {
    ...mapMutations([
      'setLoading'
    ]),
    ...mapActions([
      'getMangas',
      'getFavs',
      'unselectManga',
      'unselectChapter'
    ])
  },
  mounted() {

    // change state on navigation
    window.addEventListener('popstate', () => {

      // prevent navigation
      window.history.pushState({}, '')

      // update state
      if(this.currentNumber) {
        this.unselectChapter()
      }
      else if(this.currentSlug) {
        this.unselectManga()
      }
    })

  }
}
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Sen&display=swap');
@import url('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import '~swiper/dist/css/swiper.css';

* {
  box-sizing: border-box;
  font-family: Sen, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #eee;
}

html, body {
  padding: 0;
  margin: 0;
  background: #293241;
}

/** General */
.container {
  position: fixed;
  top: 0; bottom: 0;
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  background: #293241;
  font-size: 13px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 60px;
  padding: 18px 40px;
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  color: coral;
  border: none;
  background: rgba(255, 255, 255, .05);
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}
.content {
  flex: 1;
  overflow: auto;
}
h2 {
  margin: 0;
  margin-top: 20px;
  padding: 10px 16px;
  font-size: 16px;
}
.action {
  position: absolute;
  top: 0;
  right: 0;
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  font-size: 20px;
  text-decoration: none;
  &.-left {
    right: auto;
    left: 0;
  }
}
.cta {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background: transparent;
  border: 2px solid #999;
  border-radius: 2px;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
}

.red { color: coral !important }
.green { color: lightseagreen !important }

/** Animations */
.fade-enter-active,
.fade-leave-active,
.fade-right-enter-active,
.fade-right-leave-active,
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 300ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-right-enter,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(100%) translateZ(0);
}

.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-50px) translateZ(0);
}

</style>
