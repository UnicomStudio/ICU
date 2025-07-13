export function UUID() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`)
}

// #ifdef MP-WEIXIN
const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const b64re = /^(?:[A-Z\d+/]{4})*?(?:[A-Z\d+/]{2}(?:==)?|[A-Z\d+/]{3}=?)?$/i

// atob
export const weAtob = function (string: string) {
  string = String(string).replace(/[\t\n\f\r ]+/g, '')
  if (!b64re.test(string))
    throw new TypeError('Failed to execute \'atob\' on \'Window\': The string to be decoded is not correctly encoded.')
  string += '=='.slice(2 - (string.length & 3))
  let bitmap
  let result = ''
  let r1
  let r2
  let i = 0
  for (; i < string.length;) {
    bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12
      | (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)))

    result += r1 === 64
      ? String.fromCharCode(bitmap >> 16 & 255)
      : r2 === 64
        ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
        : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255)
  }
  return result
}
// #endif
