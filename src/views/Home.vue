<template>
  <div class="home page container">

    <input ref="search" class="search head" type="text" autocomplete="off" placeholder="BANKAI" @keyup="type($event)" />
    <button class="action" @click="focus">
      <i class="fa fa-search"></i>
    </button>

    <div class="content">

      <template v-if="!searching && lastRead">
        <h2>LAST READ</h2>
        <ul>
          <li tabindex="0" @click="selectManga(lastRead.slug)">
            <Thumbnail :manga="lastRead" />
          </li>
        </ul>
      </template>

      <template v-if="!searching && favMangas.length">
        <h2>YOUR FAVS</h2>
        <ul>
          <li v-for="(manga, i) in favMangas" :key="i" tabindex="0" @click="selectManga(manga.slug)">
            <Thumbnail :manga="manga" />
          </li>
        </ul>
      </template>

      <template v-if="searching">
        <h2>{{ searchResults.length }} MANGAS</h2>
        <ul>
          <li v-for="(manga, i) in searchResults" :key="i" tabindex="0" @click="selectManga(manga.slug)">
            <Thumbnail :manga="manga" />
          </li>
        </ul>
      </template>

      <template v-if="!searching && !favMangas.length">
        <p class="home_welcome">
          Welcome !<br>
          Start searching in more than 7000 mangas and fav your most loved to keep track of updates.
          <button class="cta" @click="focus">SEARCH</button>
        </p>
      </template>

    </div>

  </div>
</template>

<script>
import Thumbnail from '../components/Thumbnail'
import { mapGetters, mapActions } from 'vuex'
import debounce from 'debounce'
import { search } from '../api'

export default {
  components: {
    Thumbnail
  },
  data: () => ({
    search: ''
  }),
  computed: { 
    ...mapGetters([
      'favMangas'
    ]),
    searching() {
      return (this.search.length >= 3)
    }, 
    searchResults() {
      return this.searching
        ? search(this.$store.state.mangas, this.search)
        : this.$store.state.mangas
    },
    lastRead() {
      const entries = Object.entries(this.$store.state.readFlags)
      if(entries.length) {
        const max = Math.max(...entries.map(e => e[1].date))
        const [slug] = entries.find(e => e[1].date === max)
        return this.$store.state.mangas.find(m => m.slug === slug)
      }
    },
  },
  methods: {
    ...mapActions([
      'selectManga'
    ]),
    type: debounce(function(e) {
      console.log('search', e.target.value)
      this.search = e.target.value
    }, 350),
    focus() {
      this.$refs.search.focus()
    }
  },
  async created() {
    await this.$store.dispatch('getMangas')
    await this.$store.dispatch('getFavs')
    this.$store.dispatch('unload')
  }
}
</script>

<style lang="scss">
.home {

  .search {
    color: #eee;
    outline: none;
    &::placeholder {
      color: coral;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }

  ul {
    margin: 0;
    padding: 0 10px;
    list-style: none;

    li a {
      text-decoration: none;
    }
  }

  &_welcome {
    padding: 15px 40px;
    font-size: 25px;
    line-height: 40px;
    text-align: center;

    .cta {
      width: 50%;
      margin: auto;
      margin-top: 40px;
    }
  }

}
</style>