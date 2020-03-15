import { STORAGE_KEY } from './enums'
import dateformat from 'dateformat'


/**
 * Write JSON in localStorage
 * @param {String} key 
 * @param {Object} json 
 */
export function write(key, json) {
  localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(json))
}


/**
 * Read JSON from localStorage
 * @param {String} key 
 * @param {*} fallback 
 * @return {Object}
 */
export function read(key, fallback = {}) {
  const raw = localStorage.getItem(`${STORAGE_KEY}:${key}`)
  return raw ? JSON.parse(raw) : fallback
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