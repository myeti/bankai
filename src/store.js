import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import api from './api'
import { read, write } from './utils'

Vue.use(Vuex)

export default new Store({ 
  state: {
    loading: true,
    mangas: [],
    chapters: {},
    pages: {},
    favFlags: read('favs'),
    readFlags: read('read'),
    currentSlug: false,
    currentNumber: false
  },
  getters: {
    favMangas: state => state.mangas.filter(m => Object.keys(state.favFlags).includes(m.slug)),
    currentManga: state => state.mangas.find(m => m.slug === state.currentSlug),
    currentChapters: state => state.chapters[state.currentSlug],
    currentChapter: state => state.chapters[state.currentSlug]?.find(c => c.number === state.currentNumber),
    currentPages: state => state.pages[`${state.currentSlug}:${state.currentNumber}`],
    hasRead: state => state.readFlags[state.currentSlug] || { chapters: {} }
  },
  mutations: {
    setLoading(state, bool) {
      console.log('mutation.setLoading', bool)
      state.loading = !!bool
    },
    setMangas(state, mangas) {
      console.log('mutation.setMangas', mangas)
      state.mangas = mangas
    },
    setChapters(state, { slug, chapters }) {
      console.log('mutation.setChapters', slug, chapters)
      Vue.set(state.chapters, slug, chapters)
    },
    setPages(state, { slug, n, pages }) {
      console.log('mutation.setPages', slug, n, pages)
      Vue.set(state.pages, `${slug}:${n}`, pages)
    },
    setFav(state, { slug, bool }) {
      console.log('mutation.setFav', slug, bool)
      if(bool) Vue.set(state.favFlags, slug, bool)
      else Vue.delete(state.favFlags, slug)
      write('favs', state.favFlags)
    },
    setRead(state, { slug, n }) {
      console.log('mutation.setRead', slug, n)
      if(!state.readFlags[slug]) {
        Vue.set(state.readFlags, slug, {
          date: parseInt(Date.now() / 1000),
          last: n,
          chapters: {}
        })
      }
      Vue.set(state.readFlags[slug].chapters, n, true)
      write('read', state.readFlags)
    },
    setCurrentSlug(state, slug) {
      console.log('mutation.setCurrentSlug', slug)
      state.currentSlug = slug
    },
    setCurrentNumber(state, n) {
      console.log('mutation.setCurrentNumber', n)
      state.currentNumber = n
    }
  },
  actions: {
    async getMangas({ commit, state }) {
      if(!state.mangas.length) {
        console.log('action.getMangas')
        commit('setLoading', true)
        const mangas = await api.getMangaList()
        commit('setMangas', mangas)
      }
    },
    async getManga({ commit, state }, slug) {
      if(!state.chapters[slug]) {
        console.log('action.getManga', slug)
        commit('setLoading', true)
        const { chapters } = await api.getManga(state.mangas, slug)
        commit('setChapters', { slug, chapters })
      }
    },
    async getChapter({ commit, state }, { slug, n }) {
      if(!state.pages[`${slug}:${n}`]) {
        console.log('action.getChapter', slug, n)
        commit('setLoading', true)
        const { pages } = await api.getChapter(state.chapters, slug, n)
        commit('setPages', { slug, n, pages })
      }
    },
    async getFavs({ dispatch, state }) {
      console.log('action.getFavs')
      for(let slug in state.favFlags) {
        await dispatch('getManga', slug)
      }
    },
    async selectManga({ dispatch, commit }, slug) {
      console.log('action.selectManga', slug)
      await dispatch('getManga', slug)
      commit('setCurrentSlug', slug)
    },
    unselectManga({ commit }) {
      console.log('action.unselectManga')
      commit('setCurrentSlug', false)
    },
    async selectChapter({ dispatch }, { slug, n }) {
      console.log('action.selectChapter', slug, n)
      const _n = parseInt(n)
      await dispatch('getChapter', { slug, n: _n })
      this.commit('setRead', { slug, n: _n })
      this.commit('setCurrentNumber', _n)
    },
    unselectChapter({ commit }) {
      console.log('action.unselectChapter')
      commit('setCurrentNumber', false)
    },
    unload({ commit }) {
      console.log('action.unload')
      setTimeout(() => commit('setLoading', false), 800)
    }
  }
})
