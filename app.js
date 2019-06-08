const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const db = require('./models')

app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))





app.listen(port, () => {
  db.sequelize.sync()
  console.log("Express running")
})


require('./routes')(app)