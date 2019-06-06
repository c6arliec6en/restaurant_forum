const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))





app.listen(port, () => {
  console.log("Express running")
})