const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()

// Configuração para pegar dados do body em json
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))


// Rota que está no ACTION do formulário
app.post('/books/insertbook', (req, res) => {
  const title = req.body.title
  const pageqty = req.body.pageqty

  // Instrução para inserir os dados coletados no banco
  const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`
  conn.query(sql, function(err) {
    if(err) {
      console.log(err)
    }

    res.redirect('/books')
  })
})

// Rota para resgatar dados do banco
app.get('/books', (req, res) => {
  const sql = "SELECT * FROM books"
  conn.query(sql, function(err, data) {
    if(err) {
      console.log(err)
      return
    }

    const books = data
    res.render('books', {books})
  })
})

// Rota para resgatar dados individualmente
app.get('/books/:id', (req, res) => {
  const id = req.params.id
  const sql = `SELECT * FROM books WHERE id = ${id}`
  conn.query(sql, function(err, data) {
    if(err) {
      console.log(err)
      return
    }

    const book = data[0]
    res.render('book', {book})
  })
})


app.get('/', (req, res) => {
  res.render('home')
})

// Conectando no banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
})

conn.connect(function(err) {
  if(err) {
    console.log(err)
  }

  console.log('Conectou ao MySQL!')

  app.listen(3000)
})