import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { join } = path

const pagePath = join(__dirname, '../', '../', 'src', 'pages', 'dev', 'icons.astro')

function generateIconPage() {
    const newContent = getAndUpdatePageContent()
    fs.writeFile(pagePath, newContent, function(error){
        if (error) {
            console.log('Ошибка при записи файла')
            console.log(error)
        } else {
            chalk.blue('Страница успешно обновлена!')
        }
    });
}

function getAndUpdatePageContent () {
    const pageContent = fs.readFileSync(pagePath, 'utf8')
    const names = getIconsArray()
    return pageContent.replace(/<main>[\D\d]*<\/main>/gm, generateHtml(names))
}

function generateHtml (names) {
    return `<main>
        ${names.map(name => generateTemplateIcon(name)).join('\r\n')}
    </main>`
}

function getIconsArray() {
    const paht = join(__dirname, '../', '../', 'src', 'assets', 'images', 'icons')
    return fs.readdirSync(paht)
        .filter(f => f.includes('.svg'))
        .map(f => f.replace('.svg', ''))
}

function generateTemplateIcon (name) {
    return `    <div>
        <i class="icon icon-${name}" /> - 
        <span class="icon-text">&lt;icon class="icon icon-${name}" /&gt;</span>
        <span class="tooltip">Скопировано!</span>
    </div>`
}

export default generateIconPage