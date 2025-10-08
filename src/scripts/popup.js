// import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const openPopupsBtns = document.querySelectorAll('.js-open-popup');
const closePopupsBtns = document.querySelectorAll('.js-close-popup');
const popups = document.querySelectorAll('.js-popup');
const body = document.querySelector('body');
let openedPopup = false;
const targetElement = body;
// для того что бы не прыгал фон во время открытия попапа
// let scrollY;
// const windowsOS = (navigator.userAgent.toLowerCase().indexOf('windows') !== -1);
// console.log(scrollY);
// console.log(windowsOS);

// // Проверка на наличие скрола
// function getScroll(scroll, selector) {
//     var doc = document;
//     var body = doc.body;
//     var element = doc.querySelector(selector);
//     var client = 'client' + scroll;
//     scroll = 'scroll' + scroll;
//     return /CSS/.test(doc.compatMode)? (element[client]< element[scroll]) : (body[client]< body[scroll]);
// }


if (openPopupsBtns.length) {
    openPopupsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const popupName = btn.dataset.popup;
            openedPopup = document.querySelector(`.js-popup[data-popup='${popupName}']`);
            openedPopup.classList.add('open');
            openedPopup.setAttribute("aria-modal", "true");
            openedPopup.querySelector("button").focus();
            // body.classList.add('hidden');
            // вариант с бодискролл, но в ios прыгает вверх страницы когда открыт попап
            // disableBodyScroll(targetElement);
            // Проверяем операционную систему на Win и Скролл
            // if ((windowsOS) && (getScroll('Height', '.page-wrapper'))) {
            //     body.classList.add('windows');
            //     console.log(body.classList.add('windows'));
            // }
            // scrollY = window.scrollY;
            // console.log(scrollY);
            // вроде работал везде, на IOS не прыгает фон и не скролится body
            const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
            const body = document.body;
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}`;
        })
    })
}

function closePopups() {
    if (openedPopup) {
        openedPopup.classList.remove('open');
        openedPopup.setAttribute("aria-modal", "false");
        openedPopup = false;
        // вариант с бодискролл, но в ios прыгает вверх страницы когда открыт попап
        // body.classList.remove('hidden');
        // enableBodyScroll(targetElement);
        // window.scrollTo(0, scrollY);
        // console.log(window.scrollTo(0, scrollY));
        // вроде работал везде, на IOS не прыгает фон и не скролится body
        const body = document.body;
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  });

if (popups.length) {
    closePopupsBtns.forEach(btn => {
        btn.addEventListener('click', closePopups)
    })

    document.addEventListener('keydown', event => {
        if (event.keyCode === 27) {
            closePopups();
        }
    })

    document.addEventListener('mouseup', e => {
        if (!e.target.closest('.js-popup-content')) {
            closePopups();
        }
    })
}