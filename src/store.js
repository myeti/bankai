import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import api from './api'
import { read, write } from './utils'

Vue.use(Vuex)

export default new Store({ 
  state: {
    loading: true,
    list: [],
    chapters: {},
    pages: {},
    favs: read('favs'),
    read: read('read'),
    currentManga: null,
    currentChapter: null
  },
  getters: {
    favs: state => state.list.filter(m => Object.keys(state.favs).includes(m.slug)),
    manga: state => state.list.find(m => m.slug === state.currentManga),
    chapters: state => state.chapters[state.currentManga],
    chapter: state => state.chapters[state.currentManga]?.find(c => c.number === state.currentChapter),
    pages: state => state.pages[`${state.currentManga}:${state.currentChapter}`],
    read: state => state.read[state.currentManga] || { chapters: {} }
  },
  mutations: {
    setLoading(state, bool) {
      state.loading = !!bool
    },
    setList(state, list) {
      state.list = list
    },
    setChapters(state, { slug, chapters }) {
      Vue.set(state.chapters, slug, chapters)
    },
    setPages(state, { slug, n, pages }) {
      Vue.set(state.pages, `${slug}:${n}`, pages)
    },
    setFav(state, { slug, bool }) {
      if(bool) Vue.set(state.favs, slug, bool)
      else Vue.delete(state.favs, slug)
      write('favs', state.favs)
    },
    setRead(state, { slug, n }) {
      if(!state.read[slug]) {
        Vue.set(state.read, slug, {
          date: parseInt(Date.now() / 1000),
          last: n,
          chapters: {}
        })
      }
      Vue.set(state.read[slug].chapters, n, true)
      write('read', state.read)
    },
    setCurrentManga(state, slug) {
      state.currentManga = slug
    },
    setCurrentChapter(state, n) {
      state.currentChapter = n
    }
  },
  actions: {
    async getList({ commit, state }) {
      if(!state.list.length) {
        console.log('get list')
        commit('setLoading', true)
        const list = await api.getMangaList()
        commit('setList', list)
      }
    },
    async getManga({ commit, state }, slug) {
      if(!state.chapters[slug]) {
        console.log('get manga', slug)
        commit('setLoading', true)
        const { chapters } = await api.getManga(state.list, slug)
        commit('setChapters', { slug, chapters })
      }
    },
    async getChapter({ commit, state }, { slug, n }) {
      if(!state.pages[`${slug}:${n}`]) {
        console.log('get chapter', slug, n)
        commit('setLoading', true)
        const { pages } = await api.getChapter(state.chapters, slug, n)
        commit('setPages', { slug, n, pages })
      }
    },
    async getFavs({ dispatch, state }) {
      for(let slug in state.favs) {
        await dispatch('getManga', slug)
      }
    },
    async selectManga({ dispatch, commit }, slug) {
      console.log('select manga', slug)
      await dispatch('getManga', slug)
      commit('setCurrentManga', slug)
    },
    unselectManga({ commit }) {
      console.log('unselect manga')
      commit('setCurrentManga', null)
    },
    async selectChapter({ dispatch }, { slug, n }) {
      console.log('select chapter', slug, n)
      const _n = parseInt(n)
      await dispatch('getChapter', { slug, n: _n })
      this.commit('setCurrentChapter', _n)
    },
    unselectChapter({ commit }) {
      console.log('unselect chapter')
      commit('setCurrentChapter', null)
    },
    unload({ commit }) {
      setTimeout(() => commit('setLoading', false), 800)
    }
  }
})
