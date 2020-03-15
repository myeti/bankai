<template>
  <div class="thumb" :class="{ '-fav': isFav, '-completed': completed }">

    <Intersect @enter="visible = true">
      <div class="thumb_cover" :style="{ backgroundImage: (image && visible) ? `url(${image})` : null }"></div>
    </Intersect>

    <div class="thumb_content">

      <h3>{{ name }}</h3>

      <p class="thumb_status">
        {{ chapters ? chapters.length : '' }}
        {{ completed ? 'completed' : '' }}
      </p>

      <span class="thumb_fav" v-if="isFav">❤</span>

    </div>

  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Intersect from 'vue-intersect'

export default {
  props: ['id', 'image', 'name', 'completed'],
  data: () => ({
    visible: false
  }),
  components: {
    Intersect
  },
  computed: {
    chapters() {
      return this.$store.state.chapters[this.id]
    },
    isFav() {
      return this.$store.state.favs[this.id]
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
    color: rgba(255, 255, 255, .4);
  }
  &.-completed &_status {
    color: coral;
  }

  &_fav {
    position: absolute;
    bottom: 4px;
    right: 10px;
    font-size: 22px;
    color: coral;
  }
}
</style>