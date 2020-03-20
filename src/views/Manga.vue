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
            <dd>
              <i class="fa fa-book"></i> {{ manga.chapters.length }}
            </dd>

            <dt>status</dt>
            <dd class="green" v-if="manga.completed">
              <i class="fa fa-check"></i> completed
            </dd>
            <dd v-else>
              <i class="fa fa-paint-brush"></i> ongoing
            </dd>

            <template v-if="lastReadDate">
              <dt>last read</dt>
              <dd>
                <i class="fa fa-hashtag"></i> {{ lastReadChapter }} ({{ readProgress }}%)
              </dd>
              <dd>
                <i class="fa fa-clock-o"></i> {{ lastReadDate | date }}
              </dd>
            </template>

          </dl>

          <button class="cta" @click="select(lastReadChapter)">
            READ #{{ lastReadChapter }}
          </button>

        </div>

      </div>

      <ul class="manga_chapters">
        <li v-for="(chapter, i) in manga.chapters" :key="i" tabindex="0" @click="select(chapter.number)">
          <div class="manga_chapters_number"
              :class="{ green: isRead(chapter.number) }">
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
      'meta'
    ]),
    isFav() {
      return this.meta?.fav
    },
    firstChapter() {
      return this.manga.chapters[this.manga.chapters.length - 1]
    },
    lastReadDate() {
      return this.meta?.date
    },
    lastReadChapter() {
      return (!this.lastReadDate)
        ? this.firstChapter?.number
        : Math.max(...this.meta.read)
    },
    readProgress() {
      if(this.meta) {
        return Math.ceil(this.meta.read.length * 100 / this.manga.chapters.length)
      }
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
    isRead(n) {
      return this.meta?.read?.includes(n)
    },
    select(n) {
      this.selectChapter({ slug: this.manga.slug, n })
    }
  },
  mounted() {
    console.log('Manga.mounted')
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
    flex: 0 0 50%;
    padding-top: 79%;
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

      dt {
        opacity: .5;
        margin-top: 20px;
        margin-bottom: 5px;
        &:first-child {
          margin-top: 0;
        }
      }
      dd {
        margin: 0;
        margin-top: 8px;
        font-size: 18px;
        font-weight: bold;

        i {
          width: 18px;
          opacity: .6;
          color: inherit;
        }
      }

    }

    .cta {
      margin-top: 40px;
    }

    .fav {
      z-index: 20;
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
    list-style: none;

    li {
      display: flex;
      padding: 15px;
      border-top: 1px solid rgba(255, 255, 255, .3);
    }

    &_number {
      font-weight: bold;
      color: tomato;
      width: 40px;
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