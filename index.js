const BitReader = require('./src/bit-reader')
const LargeImages = require('./src/large-images.json')

/**
 * Image
 * {
 *   width: number,
 *   height: number,
 *   colorOptions: number,
 * }
 **/

function generateArt(_hash = '') {
  // remove the leading 0x, if present
  const hash = _hash.indexOf('0x') === 0 ? _hash.slice(2) : _hash
  // make sure it's hexadecimal
  if (! /[a-fA-F0-9]+/.test(hash)) {
    throw new Error('Non-hexadecimal character detected in hash')
  }
  const reader = new BitReader(hash)
  const gridSize = 8
  // position using upper left corner with increasing y as moving downward
  const smallImages = 'ȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯʰʱʲ '.slice(0, 60)
  // value from 0-16
  const bigImageIndex = reader.getNum(LargeImages.length)
  const bigImage = LargeImages[bigImageIndex]
  const xPos = reader.getNum(gridSize - bigImage.width)
  const yPos = reader.getNum(gridSize - bigImage.height)
  // console.log(`x: ${xPos}, y: ${yPos}`)
  // console.log(`Big image: ${bigImageIndex}`)

  // return a matrix
  const grid = Array.apply(null, Array(gridSize)).map(() => {
    return Array.apply(null, Array(gridSize)).map(() => {})
  })
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // for each tile determine what should be rendered
      if (
        x >= xPos &&
        x < xPos + bigImage.width &&
        y >= yPos &&
        y < yPos + bigImage.height
      ) {
        // we're in the big image
        const lines = bigImage.data.split('\n')
        grid[y][x] = lines[y - yPos][x - xPos]
        continue
      }
      // otherwise calculate individual tile info
      const tileImage = reader.getNum(smallImages.length)
      grid[y][x] = smallImages[tileImage]
    }
  }

  console.log(`Consumed ${reader.bitsConsumed} of ${reader.binaryString.length} bits`)

  console.log()
  for (const line of grid) {
    console.log(line.join(''))
  }
  console.log()
}

function hashToNumber(hash = '') {
  return +`0x${hash}`
}

// Generate a random hash
let __hash = ''
for (let x = 0; x < 40; x++) {
  __hash += Math.floor(Math.random() * 16).toString(16)
}
console.log(`0x${__hash}`)
generateArt(__hash)