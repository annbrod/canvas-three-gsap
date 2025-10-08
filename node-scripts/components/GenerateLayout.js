import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import inquirer from 'inquirer'
import templateFile from 'template-file';

const { renderFile } = templateFile
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { join } = path

async function createLayout () {
    const { name } = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Укажите название лэйаута (на латинице)'
    })

    const template = await renderFile('./node-scripts/components/Layout.astro', {})
    const path = join(__dirname, '../', '../', 'src', 'layouts', `${name}.astro`)
    
    fs.open(path, 'w', (err) => {
        if(err) throw err
    })

    fs.appendFile(path, template, (err) => {
        if(err) throw err;
    });
}

export default createLayout
