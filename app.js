const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')

const app = express()
app.use(express.json())

//create a table in the database
/*const db = new sqlite3.Database('./finance.db', err => {
  if (err) {
    console.error(err.msg)
  } else {
    console.log('connected to database')
  }
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    )`)

  db.run(
    `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category INTEGER,
        amount REAL NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        FOREIGN KEY (category) REFERENCES categories(id)
    )`,
    err => {
      if (err) {
        console.error('Error creating transactions table ' + err.message)
      }
    },
  )
})

db.close(err => {
  if (err) {
    console.error('Error closing the database connection ' + err.message)
  } else {
    console.log('Database connection closed.')
  }
})
*/

const dbPath = path.join(__dirname, 'finance.db')

let d = null

//initialization of the server
const initializeTheServer = async () => {
  try {
    d = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running in localhost 3000')
    })
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

initializeTheServer()

//creating post request for the transactions table
app.post('/transactions/', async (request, response) => {
  const {id, type, category, date, amount, description} = request.body
  const addTotransactions = `
  insert into transactions (id,type,category,amount,date,description)
  values(
  ${id},
  '${type}',
  '${category}',
  '${amount}',
  ${date},
  '${description}'
  );`
  const dbResponse = await d.run(addTotransactions)
  response.send('Data sent to transactions table')
})

//get request to get all the tables in transactions
app.get('/transactions/', async (request, response) => {
  const getData = `
  select * from transactions;`
  const g = await d.all(getData)
  response.send(g)
})

//get request to get specified data from transactions table
app.get('/transactions/:id', async (req, res) => {
  const {id} = req.params
  const dt = `select * from transactions where id=${id}`
  const data = await d.get(dt)
  res.send(data)
})

//put request to update the table
app.put('/transactions/:id/', async (req, res) => {
  const {id} = req.params
  const {type, category, date, amount, description} = req.body
  const dbquery = `update transactions set
  id='${id}',
  type='${type}',
  category='${category}',
  date='${date}',
  amount = '${amount}',
  description='${description}'
  where id=${id}
  `
  await d.run(dbquery)
  res.send('Successfully Completed')
})

//To delete a table in transactions
app.delete('/transactions/:id', async (request, response) => {
  const {id} = request.params
  const deleteQuery = `delete from transactions where id=${id}`
  await d.run(deleteQuery)
  response.send('transaction deleted Successfully')
})

//to get summary of the table
app.get('/summary', (req, res) => {
  d.all(
    `SELECT type, SUM(amount) AS total FROM transactions GROUP BY type`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(400).json({error: err.message})
      }
      res.json(rows)
    },
  )
})
