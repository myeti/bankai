export const API_URL = 'https://www.mangaeden.com/api'
export const CDN_URL = 'http://cdn.mangaeden.com/mangasimg'


/**
 * Fetch manga list
 * @return {Promise<Array>}
 */
export async function getMangaList() {

  // fetch json
  const res = await fetch(`${API_URL}/list/0/`)
  const json = await res.json()

  // map clearer props and sort ASC
  return json.manga
    .map(item => ({
      id: item.i,
      name: item.t,
      slug: item.a,
      image: item.im ? `${CDN_URL}/${item.im}` : null,
      completed: (item.s === 2)
    }))
    .sort((a, b) => (a.name > b.name) ? 1 : -1)
}


/**
 * Find manga by name
 * @param {Array} list 
 * @param {String} input 
 * @return {Array}
 */
export function search(list, input) {
  const reg = new RegExp(input, 'gi')
  return list.filter(m => reg.test(m.name) || reg.test(m.alias))
}


/**
 * Get manga details and chapters
 * @param {Array} list 
 * @param {String} slug 
 * @return {Promise<Object>}
 */
export async function getManga(list, slug) {

  // get manga by slug
  const manga = list.find(m => m.slug === slug)
  if(!manga) {
    throw Error(`Unknown manga "${slug}"`)
  }

  // fetch chapters and sort DESC
  const chapters = await getChapters(manga)
  chapters.sort((a, b) => (a.number > b.number) ? -1 : 1)

  return { manga, chapters }
}


/**
 * Fetch manga's chapters
 * @param {Object} manga 
 * @return {Promise<Array>}
 */
export async function getChapters(manga) {

  // fetch json
  const res = await fetch(`${API_URL}/manga/${manga.id}`)
  const json = await res.json()

  // map clearer props
  return json.chapters.map(item => ({
    id: item[3],
    number: item[0],
    name: item[2],
    date: item[1]
  }))
}


/**
 * Get chapter details and pages
 * @param {Array} chapters 
 * @param {String} slug 
 * @param {String} n 
 * @return {Promise<Object>}
 */
export async function getChapter(chapters, slug, n) {

  // get chapter by id
  const chapter = chapters[slug].find(c => c.number === n)
  if(!chapter) {
    throw Error(`Unknown chapter "${slug}:${n}"`)
  }

  // fetch pages
  const pages = await getPages(chapter)

  return { chapter, pages }
}


/**
 * Get chapter's pages
 * @param {Object} chapter
 * @return {Promise<Array>} 
 */
export async function getPages(chapter) {

  // fetch json
  const res = await fetch(`${API_URL}/chapter/${chapter.id}`)
  const json = await res.json()

  // map clearer props
  return json.images
    .map(item => ({
      number: item[0],
      url: `${CDN_URL}/${item[1]}`
    }))
    .sort((a, b) => (a.number > b.number) ? 1 : -1)
}


/**
 * Expose all methods
 */
export default {
  getMangaList,
  getManga,
  getChapters,
  getChapter,
  getPages,
  search
}