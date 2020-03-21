import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import api from './api'
import { read, write, cache, sortDESC } from './utils'

Vue.use(Vuex)

function forceTick(state) {
  state.meta = Object.assign({}, state.meta)
}

function initMeta(state, slug) {
  if(!state.meta[slug]) {
    state.meta[slug] = {
      fav: false,
      downloaded: false,
      date: null,
      read: []
    }
  }
}

export default new Store({ 
  state: {
    loading: true,
    loadingText: null,
    mangas: [],
    meta: read('meta'),
    current: {
      manga: false,
      chapter: false
    }
  },
  getters: {
    favMangas: state => state.mangas.filter(m => state.meta[m.slug]?.fav).sort(sortDESC('updated')),
    manga: state => state.mangas.find(m => m.slug === state.current.manga),
    chapter: (state, getters) => getters.manga?.chapters?.find(c => c.number === state.current.chapter),
    meta: state => state.meta[state.current.manga]
  },
  mutations: {
    setLoading(state, bool) {
      console.debug('mutation.setLoading', bool)
      state.loading = bool
      if(state.loading !== bool) {
        state.loadingText = null
      }
    },
    setLoadingText(state, text) {
      console.debug('mutation.setLoadingText', text)
      state.loadingText = text
    },
    setMangas(state, mangas) {
      console.debug('mutation.setMangas', mangas)
      state.mangas = mangas
    },
    setChapters(state, { slug, chapters }) {
      console.debug('mutation.setChapters', slug, chapters)
      const i = state.mangas.findIndex(m => m.slug === slug)
      Vue.set(state.mangas[i], 'chapters', chapters)
      Vue.set(state.mangas[i], 'updated', chapters[0].date)
    },
    setPages(state, { slug, n, pages }) {
      console.debug('mutation.setPages', slug, n, pages)
      const mi = state.mangas.findIndex(m => m.slug === slug)
      const ci = state.mangas[mi].chapters.findIndex(c => c.number === n)
      Vue.set(state.mangas[mi].chapters[ci], 'pages', pages)
    },
    setFav(state, { slug, bool }) {
      console.debug('mutation.setFav', slug, bool)
      initMeta(state, slug)
      Vue.set(state.meta[slug], 'fav', bool)
      Vue.set(state.meta, slug, Object.assign({}, state.meta[slug]))
      forceTick(state)
      write('meta', state.meta)
    },
    setDownloaded(state, slug) {
      console.debug('mutation.setDownloaded', slug)
      initMeta(state, slug)
      Vue.set(state.meta[slug], 'downloaded', true)
      Vue.set(state.meta, slug, Object.assign({}, state.meta[slug]))
      forceTick(state)
      write('meta', state.meta)
    },
    setRead(state, { slug, n }) {
      console.debug('mutation.setRead', slug, n)
      initMeta(state, slug)
      if(!state.meta[slug].read.includes(n)) {
        state.meta[slug].read.push(n)
      }
      Vue.set(state.meta[slug], 'date', parseInt(Date.now() / 1000))
      Vue.set(state.meta, slug, Object.assign({}, state.meta[slug]))
      forceTick(state)
      write('meta', state.meta)
    },
    setCurrentManga(state, slug) {
      console.debug('mutation.setCurrentManga', slug)
      Vue.set(state.current, 'manga', slug)
    },
    setCurrentChapter(state, n) {
      console.debug('mutation.setCurrentChapter', n)
      Vue.set(state.current, 'chapter', n)
    }
  },
  actions: {
    async getMangas({ commit, state }) {
      if(!state.mangas.length) {
        console.debug('action.getMangas')
        commit('setLoading', true)
        const mangas = await api.getMangaList()
        commit('setMangas', mangas)
      }
    },
    async getManga({ commit, state }, slug) {
      const manga = state.mangas.find(m => m.slug === slug)
      if(!manga?.chapters) {
        console.debug('action.getManga', slug)
        commit('setLoading', true)
        const { chapters } = await api.getManga(state.mangas, slug)
        commit('setChapters', { slug, chapters })
      }
    },
    async getChapter({ commit, state, getters }, { slug, n }) {
      const manga = state.mangas.find(m => m.slug === slug)
      const chapter = manga?.chapters?.find(c => c.number === n)
      if(!chapter?.pages) {
        console.debug('action.getChapter', slug, n)
        commit('setLoading', true)
        const { pages } = await api.getChapter(getters.manga.chapters, slug, n)
        commit('setPages', { slug, n, pages })
      }
    },
    async getFavs({ dispatch, state }) {
      console.debug('action.getFavs')
      for(let slug in state.meta) {
        if(state.meta[slug].fav) {
          await dispatch('getManga', slug)
        }
      }
    },
    async selectManga({ dispatch, commit }, slug) {
      console.debug('action.selectManga', slug)
      await dispatch('getManga', slug)
      commit('setCurrentManga', slug)
    },
    unselectManga({ commit }) {
      console.debug('action.unselectManga')
      commit('setCurrentManga', false)
    },
    async selectChapter({ dispatch }, { slug, n }) {
      console.debug('action.selectChapter', slug, n)
      const _n = parseInt(n)
      await dispatch('getChapter', { slug, n: _n })
      this.commit('setRead', { slug, n: _n })
      this.commit('setCurrentChapter', _n)
    },
    async download({ dispatch, commit, state, getters }) {
      console.debug('action.download')
      const slug = getters.manga.slug
      initMeta(state, slug)
      commit('setLoading', true)
      commit('setLoadingText', '0%')
      try {
        for(let i = 0; i < getters.manga.chapters.length; i++) {
          const chapter = getters.manga.chapters[i]
          const p1 = Math.ceil(i * 100 / getters.manga.chapters.length)
          await dispatch('getChapter', { slug, n: chapter.number })
          for(let j = 0 ; j < chapter.pages.length; j++) {
            await cache(chapter.pages[j].url)
            const p2 = (j+1) * 100 / chapter.pages.length
            const p3 = Math.ceil(p2 / getters.manga.chapters.length)
            commit('setLoadingText', `${p1+p3}%`)
          }
        }
        commit('setDownloaded', slug)
      }
      catch(err) {
        alert('Error, aborting.')
      }
      commit('setLoading', false)
    },
    unselectChapter({ commit }) {
      console.debug('action.unselectChapter')
      commit('setCurrentChapter', false)
    },
    unload({ commit }) {
      console.debug('action.unload')
      setTimeout(() => commit('setLoading', false), 800)
    }
  }
})
