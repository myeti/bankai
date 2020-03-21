import { STORAGE_KEY } from './enums'
import dateformat from 'dateformat'

let _cache = null
let _local = localStorage


/**
 * Write JSON in localStorage
 * @param {String} key 
 * @param {Object} json 
 */
export function write(key, json) {
  _local.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(json))
}


/**
 * Read JSON from localStorage
 * @param {String} key 
 * @param {*} fallback 
 * @return {Object}
 */
export function read(key, fallback = {}) {
  const raw = _local.getItem(`${STORAGE_KEY}:${key}`)
  return raw ? JSON.parse(raw) : fallback
}


/**
 * Cache image url
 * @param {String} url 
 */
export async function cache(url) {
  if(!_cache) {
    _cache = await caches.open(STORAGE_KEY)
  }
  const res = await fetch(url, { mode: 'no-cors' })
  await _cache.add(res)
}


/**
 * Async load image
 * @param {String} url 
 * @return {Promise<Image>}
 */
export function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = url
  })
}
  

/**
 * Convert timestamp to date string
 * @param {Number} ts 
 * @return {String}
 */
export function formatDate(ts) {
  const date = new Date(ts * 1000)
  return dateformat(date, 'dd.mm.yyyy')
}


/**
 * Sort ASC
 * @param {String} prop
 * @return {Array}
 */
export function sortASC(prop) {
  return (a, b) => (a[prop] > b[prop]) ? 1 : -1
}


/**
 * Sort DESC
 * @param {String} prop
 * @return {Array}
 */
export function sortDESC(prop) {
  return (a, b) => (a[prop] > b[prop]) ? -1 : 1
}