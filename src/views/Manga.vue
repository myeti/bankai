<template>
  <div class="manga page container">

    <h1 class="head">{{ manga.name }}</h1>
    <button class="action" @click="unselectManga()">
      <i class="fa fa-times"></i>
    </button>

    <div class="content">

      <div class="manga_top">

        <div class="manga_cover" :style="{ backgroundImage: `url(${manga.image})` }"></div>

        <div class="manga_summary">
          <button class="fav" @click="setFav({ slug: manga.slug, bool: !isFav })">
            <i class="fa fa-bookmark" v-if="isFav"></i>
            <i class="fa fa-bookmark-o" v-else></i>
          </button>
          <dl>
            <dt>chapters</dt>
            <dd>{{ chapters.length }}</dd>
            <dt>status</dt>
            <dd>{{ manga.completed ? 'completed' : 'ongoing' }}</dd>
            <dt>last update</dt>
            <dd>{{ lastChapter.date | date }}</dd>
            <dt>last read</dt>
            <dd v-if="read.date">{{ read.date | date }}</dd>
            <dd v-else>{{ 'never' }}</dd>
          </dl>
          <button class="cta" @click="select(lastChapterRead)">
            READ {{ (lastChapterRead < 2) ? '' : lastChapterRead }}
          </button>
        </div>

      </div>

      <ul class="manga_chapters">
        <li v-for="(chapter, i) in chapters" :key="i"
            :class="{ read: read.chapters[chapter.number] }"
            tabindex="0"
            @click="select(chapter.number)">
          <div class="manga_chapters_number">
            {{ chapter.number }}
          </div>
          <div class="manga_chapters_details">
            <div class="manga_chapters_name">
              {{ chapter.name }}
            </div>
            <div class="manga_chapters_date">
              {{ chapter.date | date }}
            </div>
          </div>
        </li>
      </ul>
      
    </div>


  </div>
</template>

<script>
import dateformat from 'dateformat'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'manga',
      'chapters',
      'read'
    ]),
    isFav() {
      return this.$store.state.favs[this.manga.slug]
    },
    firstChapter() {
      return this.chapters[this.chapters.length - 1]
    },
    lastChapter() {
      return this.chapters[0]
    },
    lastChapterRead() {
      if(!this.read.date) return this.firstChapter.number;
      return Math.max(Object.keys(this.read.chapters))
    }
  },
  methods: {
    ...mapMutations([
      'setFav'
    ]),
    ...mapActions([
      'selectChapter',
      'unselectManga',
    ]),
    select(n) {
      this.selectChapter({ slug: this.manga.slug, n })
    }
  },
  mounted() {
    this.$store.dispatch('unload')
  }
}
</script>

<style lang="scss" scoped>
.manga {

  &_top {
    position: relative;
    display: flex;
    padding: 20px 15px;
  }

  &_cover {
    flex: 0 0 55%;
    background-position: center center;
    background-size: contain;
    background-color: lightgray;
    @media screen and (min-width: 768px) {
      flex: 0 0 100px;
    }

    img {
      display: block;
      width: 100%;
      border-radius: 2px;
    }
  }

  &_summary {
    flex: 0 0 45%;
    padding-left: 20px;

    dl {
      margin: 0;

      dd {
        margin: 0;
        margin-bottom: 15px;
        color: coral;
        font-size: 22px;
        font-weight: bold;
      }
    }

    .fav {
      position: absolute;
      top: 15px;
      right: 10px;
      background: transparent;
      height: 35px;
      width: 35px;
      border: none;
      color: #999;
      font-size: 22px;
      line-height: 20px;
      padding: 0;
      outline: none;
      transition: all 300ms;
    }
  }

  &_chapters {
    padding: 0;
    margin: 0;
    margin-top: 20px;
    list-style: none;

    li {
      display: flex;
      padding: 15px;
      border-top: 1px solid rgba(255, 255, 255, .3);
    }

    &_number {
      font-weight: bold;
      color: coral;
      width: 40px;
    }
    li.read &_number {
      color: lightseagreen;
    }

    &_date {
      opacity: .5;
      margin-top: 2px;
    }
  }

}

@keyframes spinY {
  from { transform: rotateY(0) }
  to { transform: rotateY(180deg) }
}
</style>