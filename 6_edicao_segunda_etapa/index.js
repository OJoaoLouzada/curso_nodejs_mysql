const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()


// Configuração para pegar dados do body em json (req.body)
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())


// Configurando a engine
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

// Rota para edição de dados
app.get('/books/edit/:id', (req, res) => {
  const id = req.params.id
  const sql = `SELECT * FROM books WHERE id = ${id}`
  conn.query(sql, function(err, data) {
    if(err) {
      console.log(err)
      return
    }

    const book = data[0]
    res.render('editbook', {book})
  })
})

// Rota que está no formulário para conseguir editar
app.post('/books/updatebook', (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const pageqty = req.body.pageqty

  // A instrução para atualizar o banco com as novas informações utiliza o SET. Filtramos com WHERE id = ${id} para atualizar somente o id que estamos acessando. Se não filtrar pelo id, ele vai atualizar todos os registros da tabela do banco.
  const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`
  conn.query(sql, function(err) {
    if(err) {
      console.log(err)
      return
    }

    res.redirect('/books')
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