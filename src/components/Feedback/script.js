import JustValidate from 'just-validate';
import Inputmask from "inputmask";

// initialize the validation library
document.querySelectorAll('.js-form').forEach(form => {
    const validation = new JustValidate(form, {
        errorFieldCssClass: 'is-invalid',
    });
    // apply rules to form fields
    validation
    .addField('.js-form-name', [
        {
            rule: 'required',
            errorMessage: 'Заполните поле',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Заполните поле',
        },
    ])
    .addField('.js-form-phone', [
        {
            rule: 'required',
            errorMessage: 'Заполните поле',
        },
        {
            validator: (value, context) => {
                if (value.includes('_',0)) {
                    return false
                } else {
                    return true
                }
            },
            errorMessage: 'Введите корректный номер телефона',
        }
    ])
    .addField('.js-form-mail', [
        {
            rule: 'required',
            errorMessage: 'Заполните поле',
        },
        {
            rule: 'email',
            errorMessage: 'Введите корректный Email',
        },
    ])
    .addField('.js-form-description', [
        {
            rule: 'required',
            errorMessage: 'Заполните поле',
        }
    ])
    .addField('.js-form-select', [
        {
            rule: 'required',
            errorMessage: 'Выберите',
        }
    ])
    .onSuccess((event) => {
        console.log('Validation passes and form submitted', event);
    });
})

const phoneMask = new Inputmask({
    mask: '+7 (999) 999-99-99',
    showMaskOnHover: false,
})

document.querySelectorAll('.js-form-phone').forEach(input => {
    phoneMask.mask(input)
})
