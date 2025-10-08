const tabs = document.querySelectorAll('[data-tab-filter-target]')
const tabContents = document.querySelectorAll('[data-tab-filter-content]')
const tabsInner = document.querySelector('.js-tab-filter-content')

tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        const wrap = this.closest('.js-tab-filter-wrap')
        const tabContents = wrap.querySelectorAll('[data-tab-filter-content]')
        const tabButtons = document.querySelectorAll('[data-tab-filter-target]')
        const tabval = this.getAttribute('data-tab-filter-target')

        tabContents.forEach(tabContent => {
            // tabContent.classList.remove('active')
            const contentval = tabContent.getAttribute('data-tab-filter-content')
            tabContent.style.display = "none";
            if (contentval === tabval) {
                tabContent.style.display = "block";
            }

            if(tabval === 'all') {
                tabContent.style.display = "block";
            }
        })

        tabButtons.forEach(tab => {
            tab.classList.remove('active')
        })


        tab.classList.add('active')
    })
})



async function getProducts() {
    let products = await fetch('https://dummyjson.com/products');
    let allProducts = await products.json();
    console.log(allProducts)
    let html = '';
    let allCategories = ['all'];

    allProducts.products.forEach((item) => {
        html += `
            <a class="card-filter" data-tab-filter-content=${item.category} href="javascript:void(0);" title="${item.title}">
                <div class="card-filter__picture-wrap">
                    <picture class="card-filter__picture">
                        <img src="${item.images[0]}" alt="${item.title}" class="card-filter__image" loading="lazy"></img>
                    </picture>
                </div>
                <div class="card-filter__content">
                    <span class="card-filter__title">${item.title}</span>
                <div class="card-filter__information">
                    <span>$${item.price}</span>
                    <span>
                        <i class="icon icon-star"></i>
                        ${item.rating}
                    </span>
                    <span>${item.stock} in stock</span>
                </div>
                <span class="card-filter__description">${item.description}</span>
                </div>
            </a>
        `
        allCategories.push(item.category);
    });

    let uniqueCategories = [...new Set(allCategories)];

    tabsInner.innerHTML = html

    console.log(uniqueCategories)

}

getProducts();
