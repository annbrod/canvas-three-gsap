import Choices from 'choices.js'

document.querySelectorAll('.js-select').forEach(selectClass => {
    new Choices(selectClass, {
        allowHTML: true,
        editItems: true,
        maxItemCount: 5,
    });
})