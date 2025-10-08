const express = require('express')
const formidable = require('express-formidable');

// Create express instance
const app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(formidable());

// Require API routes
const test = require('./router/test')
// Import API Routes
app.use(test)

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
