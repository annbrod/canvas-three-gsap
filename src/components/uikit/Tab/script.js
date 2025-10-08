const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll('[data-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const wrap = this.closest('.js-tab-wrap')
        const tabContents = wrap.querySelectorAll('[data-tab-content]')
        const tabs = document.querySelectorAll('[data-tab-target]')

        const fadeIn = (el, timeout, display) => {
            el.style.opacity = 0;
            el.style.display = display || 'block';
            el.style.transition = `opacity ${timeout}ms`;
            setTimeout(() => {
                el.style.opacity = 1;
            }, 10);
        };

        const fadeOut = (el, timeout) => {
            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;
          
            setTimeout(() => {
                el.style.display = 'none';
            }, timeout);
        };

        const target = document.querySelector(tab.dataset.tabContents)

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })

        tabs.forEach(tab => {
            tab.classList.remove('active')
        })

        tab.classList.add('active')
        target.classList.add('active')

        console.log(tabContents.dataset == tabs.dataset);
    })
})