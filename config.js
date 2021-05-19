const mysql = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'desafiomysql'
  }
}

const sqlite3 = {
  client: 'sqlite3',
  connection: { filename: './database/mensajes.sqlite3' },
  useNullAsDefault: true
}

export { mysql, sqlite3 }