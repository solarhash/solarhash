const generateArt = require('.')

// Generate a random hash
let __hash = ''
for (let x = 0; x < 40; x++) {
  __hash += Math.floor(Math.random() * 16).toString(16)
}
console.log(`0x${__hash}`)
console.log()
console.log(generateArt(__hash))
console.log()
