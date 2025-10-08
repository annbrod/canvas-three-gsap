import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import inquirer from 'inquirer'
import templateFile from 'template-file';

const { renderFile } = templateFile
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const { join } = path

const COMPONENT_DEFAULT = 'Обычный компонент'
const COMPONENT_UIKIT = 'Компонент ui-kit'
const USE_TYPESCRIPT = 'Использовать TypeScript'
const USE_JAVASCRIPT = 'Использовать JavaScript'

async function createComponent () {
    const componentPath = join(__dirname, '../', '../', 'src', 'components')
    const componentPathUiKit = join(__dirname, '../', '../', 'src', 'components', 'uikit')
    const pathObj = {
        [COMPONENT_DEFAULT]: componentPath,
        [COMPONENT_UIKIT]: componentPathUiKit
    }

    const { name, type, useJs } = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'name',
                message: 'Укажите название компонента (на латинице)'
            },
            {
                type: 'list',
                name: 'type',
                message: 'Определите тип компонента',
                choices: [COMPONENT_DEFAULT, COMPONENT_UIKIT]
            },
            {
                type: 'list',
                name: 'useJs',
                message: 'Выберите тип файла скрипта',
                choices: [USE_JAVASCRIPT, USE_TYPESCRIPT]
            }
        ]
    )

    const targetPath = pathObj[type]
    const scriptPath = useJs === USE_JAVASCRIPT
        ? `./script.js`
        : `./script.ts`
    const createFileScriptPath = useJs === USE_JAVASCRIPT
        ? `${targetPath}/${name}/script.js`
        : `${targetPath}/${name}/script.ts`

    const filesPath = [
        { path: `${targetPath}/${name}`, type: 'dir' },
        { path: `${targetPath}/${name}/${name}.astro`, type: 'file' },
        { path: `${targetPath}/${name}/style.scss`, type: 'file' },
        { path: createFileScriptPath, type: 'file' }
    ]

    const template = await renderFile('./node-scripts/components/Component.astro', { scriptPath })

    filesPath.forEach(p => {
        if (p.type === 'dir') {
            fs.mkdir(p.path, (err) => {
                if(err) throw err
            })
        }

        if (p.type === 'file') {
            fs.open(p.path, 'w', (err) => {
                if(err) throw err
            })
        }
    })

    fs.appendFile(`${targetPath}/${name}/${name}.astro`, template, (err) => {
        if(err) throw err;
    });
}

export default createComponent
