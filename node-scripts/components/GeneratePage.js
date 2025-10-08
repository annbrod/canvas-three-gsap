import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import inquirer from 'inquirer'
import templateFile from 'template-file'

import generateNavigationPage from '../navigation-page/generateNavigationPage.js'

const { renderFile } = templateFile
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { join } = path

async function createPage () {
    const layouts = getLayoutsArray()
    const { name, title, description, keywords, image, layout } = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'name',
                message: 'Укажите название страницы (на латинице)'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Укажите title страницы'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Укажите meta атрибут description'
            },
            {
                type: 'input',
                name: 'keywords',
                message: 'Укажите meta атрибут keywords'
            },
            {
                type: 'input',
                name: 'image',
                message: 'Укажите url для og-метки изображения сайта'
            },
            {
                type: 'list',
                name: 'layout',
                message: 'Выберите лейаут для страницы',
                choices: layouts
            }
        ]
    )

    const template = await renderFile('./node-scripts/components/Page.astro', {
        title,
        description,
        keywords,
        image,
        layout,
        layoutName: layout.replace('.astro', '')
    })

    const path = join(__dirname, '../', '../', 'src', 'pages', `${name}.astro`)
    
    fs.open(path, 'w', (err) => {
        if(err) throw err
    })

    fs.appendFile(path, template, (err) => {
        if(err) throw err;
    })

    generateNavigationPage()
}

function getLayoutsArray () {
    const paht = join(__dirname, '../', '../', 'src', 'layouts')
    return fs.readdirSync(paht)
        .filter(f => f.includes('.astro'))
}

export default createPage
