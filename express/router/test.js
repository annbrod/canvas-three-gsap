const { Router } = require('express')
const router = Router()

router.get('/test', (req, res) => {
    const response = {
        success: true,
        users: [
            {
                name: 'Valentin',
                age: 30,
                role: 'developer'
            },
            {
                name: 'Anastasia',
                age: 23,
                role: 'manager'
            },
            {
                name: 'Vladislav',
                age: 53,
                role: 'devops'
            }
        ]
    }
    res.status(200).json(response)
})

module.exports = router