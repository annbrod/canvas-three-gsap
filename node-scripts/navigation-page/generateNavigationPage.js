import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { join } = path

const pagePath = join(__dirname, '../', '../', 'src', 'pages', 'dev', 'pages.astro')

function generateNavigationPage() {
    const newContent = getAndUpdatePageContent()
    fs.writeFile(pagePath, newContent, function(error) {
        if (error) {
            console.log('Ошибка при записи файла')
            console.log(error)
        } else {
            console.log('Страница успешно обновлена!')
        }
    });
}

function getAndUpdatePageContent () {
    const pageContent = fs.readFileSync(pagePath, 'utf8')
    const names = getPageArray()
    return pageContent.replace(/<main>[\D\d]*<\/main>/gm, generateHtml(names))
}

function generateHtml (names) {
    return `<main>
            <ul>
${names.map(name => generateTemplateItem(name)).join('\r\n')}
            </ul>
        </main>`
}

function getPageArray() {
    const paht = join(__dirname, '../', '../', 'src', 'pages')
    return fs.readdirSync(paht)
        .filter(f => f.includes('.astro'))
        .map(f => f.replace('.astro', ''))
}

function generateTemplateItem (name) {
    return `                <li>
                    <a href="/${name}.html">${name} page</a>
                </li>`
}

export default generateNavigationPage