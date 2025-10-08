import path, { join } from 'path'
import Fontagon from 'fontagon'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import generateIconPage from './generateIconPage.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const paths = {
  files: join(__dirname, '../../', 'src', 'assets', 'images', 'icons', '*.svg'),
  dist: join(__dirname, '../../', 'public', 'fonts', 'webfont-icons')
}

async function generateIconfont() {
  try {
    await Fontagon({
      files: [paths.files],
      dist: paths.dist,
      fontName: 'icons',
      order: ['woff', 'woff2'],
      style: 'css',
      classOptions: {
        baseClass: 'icon',
        classPrefix: 'icon'
      }
    })
    chalk.blue('Шрифты успешно созданы!')
    generateIconPage()
  } catch (err) {
    console.log('fail! ', err)
  }
}

export default generateIconfont