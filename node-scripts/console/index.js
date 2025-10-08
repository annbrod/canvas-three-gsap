import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import inquirer from 'inquirer'

import generateIconPage from '../fontagon/generateIconPage.js'
import generateIconfont from '../fontagon/fontagon.js'
import generateNavigationPage from '../navigation-page/generateNavigationPage.js'
import createLayout from '../components/GenerateLayout.js'
import createPage from '../components/GeneratePage.js'
import createComponent from '../components/GenerateComponent.js'

const GENERATE_ICONFONT = 'Сгенерировать иконочный шрифт'
const GENRATE_ICONFONT_PAGE = 'Обновить страницу со шрифтами'
const GENERATE_NAVIGATION_PAGE = 'Обновить страницу страниц (навигация по созданным страницам)'
const EXIT_CONSOLE = 'Выйти из консоли'
const CREATE_LAYOUT = 'Создать новый layout'
const CREATE_PAGE = 'Создать новую страницу'
const CREATE_COMPONENT = 'Создать новый компонент'

const functionByActionName = {
    [GENERATE_ICONFONT]: generateIconfont,
    [GENRATE_ICONFONT_PAGE]: generateIconPage,
    [GENERATE_NAVIGATION_PAGE]: generateNavigationPage,
    [CREATE_LAYOUT]: createLayout,
    [CREATE_PAGE]: createPage,
    [CREATE_COMPONENT]: createComponent
}

clear()
console.log(chalk.blue(figlet.textSync('Astro GRPHN', { horizontalLayout: 'full' })))

setTimeout(async () => {
    await start()
}, 300)

async function start () {
    const startActionList = [
        {
            type: 'list',
            name: 'action',
            message: 'Выберите дальнейшее действие',
            choices: [
                CREATE_COMPONENT,
                CREATE_PAGE,
                CREATE_LAYOUT,
                GENERATE_ICONFONT,
                GENRATE_ICONFONT_PAGE,
                GENERATE_NAVIGATION_PAGE,
                EXIT_CONSOLE
            ]
        }
    ]
    const { action } = await inquirer.prompt(startActionList)
    if (action === EXIT_CONSOLE) {
        clear()
        console.log(chalk.blue(
            figlet.textSync('Good job!', { horizontalLayout: 'full' }),
            figlet.textSync('See you later!', { horizontalLayout: 'full' })
        ))
        return
    }
    await functionByActionName[action]()
    setTimeout(async () => {
        await start()
    }, 300)
}
