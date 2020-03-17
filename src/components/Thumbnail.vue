<template>
  <div class="thumb" :class="{ '-fav': isFav, '-completed': manga.completed }">

    <Intersect @enter="visible = true">
      <div class="thumb_cover" :style="{ backgroundImage: (manga.image && visible) ? `url(${manga.image})` : null }"></div>
    </Intersect>

    <div class="thumb_content">

      <h3>{{ manga.name }}</h3>

      <p class="thumb_status">
        <span v-if="chapters" :class="{ uptodate: diff === 0 }">
          {{ chapters.length }}
          <sup v-if="diff > 0">-{{ diff }}</sup>
        </span>
        <span v-if="chapters">{{ chapters[0].date | date }}</span>
        <span v-if="manga.completed">completed</span>
      </p>

      <span class="thumb_fav" v-if="isFav">
        <i class="fa fa-bookmark"></i>
      </span>

    </div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Intersect from 'vue-intersect'

export default {
  props: ['manga'],
  data: () => ({
    visible: false
  }),
  components: {
    Intersect
  },
  computed: {
    chapters() {
      return this.$store.state.chapters[this.manga.slug]
    },
    isFav() {
      return this.$store.state.favs[this.manga.slug]
    },
    diff() {
      const read = this.$store.state.read[this.manga.slug]
      if(!read || !this.chapters) return false
      const readlen = Object.keys(read.chapters).length
      return this.chapters.length - readlen
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
  height: 80px;
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
    flex: 0 0 55px;
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
    padding: 4px 14px 4px;
    @media screen and (min-width: 768px) {
      padding: 4px 20px 8px;
    }

    h3 {
      margin: 0;
      font-size: 20px;
      line-height: 20px;
      font-weight: normal;
      @media screen and (min-width: 768px) {
        font-size: 32px;
        line-height: 32px;
      }
    }

    p {
      margin: 0;
    }
  }

  &_status {
    font-weight: bold;
    opacity: .5;

    span {
      padding: 0 10px;
      border-right: 1px solid rgba(255, 255, 255, .2);
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        border: none;
      }
      &.uptodate {
        color: lightseagreen;
      }
      sup {
        color: coral;
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