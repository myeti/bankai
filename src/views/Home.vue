<template>
  <div class="home page container">

    <input ref="search" class="search head" type="text" autocomplete="off" placeholder="❲ BANKAI ❳" @keyup="type($event)" />
    <button class="action" @click="focus">
      <i class="fa fa-search"></i>
    </button>

    <div class="content">

      <template v-if="!searching && favs.length">
        <h2>YOUR FAVS</h2>
        <ul>
          <li v-for="(manga, i) in favs" :key="i" tabindex="0" @click="selectManga(manga.slug)">
            <Thumbnail :manga="manga" />
          </li>
        </ul>
      </template>

      <template v-if="searching">
        <h2>{{ filtered.length }} MANGA</h2>
        <ul>
          <li v-for="(manga, i) in filtered" :key="i" tabindex="0" @click="selectManga(manga.slug)">
            <Thumbnail :manga="manga" />
          </li>
        </ul>
      </template>


      <template v-if="!searching && !favs.length">
        <p class="home_welcome">
          Welcome !<br>
          Start searching in more than 7000 manga and fav your most loved to keep track of updates.
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
      'favs'
    ]),
    searching() {
      return (this.search.length >= 3)
    }, 
    filtered() {
      return this.searching
        ? search(this.$store.state.list, this.search)
        : this.$store.state.list
    }
  },
  methods: {
    ...mapActions([
      'selectManga'
    ]),
    type: debounce(function(e) {
      console.log('debounced')
      this.search = e.target.value
    }, 350),
    focus() {
      this.$refs.search.focus()
    }
  },
  async created() {
    await this.$store.dispatch('getList')
    await this.$store.dispatch('getFavs')
    this.$store.dispatch('unload')
  }
}
</script>

<style lang="scss">
.home {

  .search {
    outline: none;
    &::placeholder {
      color: #eee;
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