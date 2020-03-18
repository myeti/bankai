<template>
  <div class="thumb" :class="{ '-fav': isFav, '-completed': manga.completed }">

    <Intersect @enter="visible = true">
      <div class="thumb_cover" :style="{ backgroundImage: (manga.image && visible) ? `url(${manga.image})` : null }"></div>
    </Intersect>

    <div class="thumb_content">

      <h3>{{ manga.name }}</h3>

      <ul class="thumb_status">
        <li v-if="chapters">
          <i class="fa fa-book"></i> {{ chapters.length }}
          <span class="red" v-if="lastReadChapter">
            <i class="fa fa-arrow-right"></i> {{ lastReadChapter }} ({{ readProgress }}%)
          </span>
        </li>
        <li v-if="chapters">
          <i class="fa fa-clock-o"></i> {{ chapters[0].date | date }}
        </li>
        <li class="green" v-if="manga.completed">
          <i class="fa fa-check"></i> completed
        </li>
        <li v-if="!manga.completed">
          <i class="fa fa-paint-brush"></i> ongoing
        </li>
      </ul>

      <span class="thumb_fav" v-if="isFav">
        <i class="fa fa-bookmark"></i>
      </span>

    </div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Intersect from 'vue-intersect'
import pkg from '../../package.json'

export default {
  props: ['manga'],
  data: () => ({
    visible: false,
    version: pkg.version
  }),
  components: {
    Intersect
  },
  computed: {
    chapters() {
      return this.$store.state.chapters[this.manga.slug]
    },
    isFav() {
      return this.$store.state.favFlags[this.manga.slug]
    },
    lastReadChapter() {
      const read = this.$store.state.readFlags[this.manga.slug]
      if(read?.date) {
        return Math.max(...Object.keys(read.chapters))
      }
    },
    readProgress() {
      const read = this.$store.state.readFlags[this.manga.slug]
      if(!read || !this.chapters) return false
      const readlen = Object.keys(read.chapters).length
      return Math.round(readlen * this.chapters.length / 100)
    }
  },
  methods: {
    ...mapMutations([
      'setFav'
    ])
  }
}
</script>

<style lang="scss" scoped>
.thumb {
  position: relative;
  display: flex;
  height: 130px;
  margin-bottom: 10px;
  padding: 6px;
  border-radius: 2px;
  background: rgba(255, 255, 255, .05);
  border: 1px solid rgba(255, 255, 255, .1);
  outline: none;
  @media screen and (min-width: 768px) {
    height: 140px;
    margin-bottom: 20px;
  }

  &_cover {
    flex: 0 0 80px;
    height: 100%;
    background-position: center center;
    background-size: cover;
    background-color: lightgray;
    border-radius: 2px;
    @media screen and (min-width: 768px) {
      flex: 0 0 100px;
    }
  }

  &_content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0 4px 14px;
    @media screen and (min-width: 768px) {
      padding: 4px 20px 8px;
    }

    h3 {
      margin: 0;
      font-size: 22px;
      line-height: 20px;
      font-weight: normal;
      @media screen and (min-width: 768px) {
        font-size: 32px;
        line-height: 32px;
      }
    }
  }

  &_status {
    padding: 0;
    margin: 0;
    list-style: none;
    opacity: .8;

    li {
      margin-top: 5px;

      i {
        color: inherit;
      }
    }
  }

  &_fav {
    position: absolute;
    top: -4px;
    right: 10px;
    font-size: 20px;
    color: coral;
  }
}
</style>