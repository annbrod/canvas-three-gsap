let toggles = document.getElementsByClassName("js-accordion-toggle");
let contentDiv = document.getElementsByClassName("js-accordion-content");
let icons = document.getElementsByClassName("icon");

for (let i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", () => {
        if (parseInt(contentDiv[i].style.height) != contentDiv[i].scrollHeight) {
            contentDiv[i].style.height = contentDiv[i].scrollHeight + "px";
            toggles[i].classList.add("active");
            icons[i].classList.remove("plus");
            icons[i].classList.add("minus");
        } else {
            contentDiv[i].style.height = "0px";
            toggles[i].classList.remove("active");
            icons[i].classList.remove("minus");
            icons[i].classList.add("plus");
        }

        for (let j = 0; j < contentDiv.length; j++) {
            if (j !== i) {
                contentDiv[j].style.height = 0;
                toggles[j].classList.remove("active");
                icons[j].classList.remove("minus");
                icons[j].classList.add("plus");
            }
        }
    });
}