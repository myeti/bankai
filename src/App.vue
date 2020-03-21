<template>
  <div id="app">

    <transition name="fade">
      <Loading v-if="loading" />
    </transition>

    <Home />

    <transition name="fade-right">
      <Manga v-if="current.manga" />
    </transition>

    <transition name="fade-right">
      <Chapter v-if="current.manga && current.chapter !== false" />
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
      'current',
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
      if(this.current.chapter) {
        this.unselectChapter()
      }
      else if(this.current.manga) {
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
@import './assets/scss/vars';

* {
  box-sizing: border-box;
  font-family: Sen, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
}

html, body {
  padding: 0;
  margin: 0;
  background: $bg-dark-color;
}

/** General */
.container {
  position: fixed;
  top: 0; bottom: 0;
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  background: $bg-dark-color;
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
  padding: 16px 40px;
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  color: $prime-color;
  border: none;
  background: $bg-color;
  border-top: 4px solid $prime-color;
  box-shadow: 0 0 4px rgba(0, 0, 0, .4);
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
  outline: none;
  &:focus {
    background: $border-color;
  }
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
  border: 2px solid $border-color;
  border-radius: 2px;
  text-decoration: none;
  text-align: center;
  font-weight: bold;
  outline: none;
  &:focus {
    background: $border-color;
  }
}

.red { color: $prime-color !important }
.green { color: $green-color !important }

/** Animations */
.fade-enter-active,
.fade-leave-active,
.fade-right-enter-active,
.fade-right-leave-active,
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 300ms ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-right-enter,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(100vw);
}

.fade-up-enter,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

</style>
