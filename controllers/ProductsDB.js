import knex from 'knex'

class ProductsDB {
  constructor(config) {
    this.knex = knex(config);
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
      .then(() => {
        return this.knex.schema.createTable('productos', table => {
          table.increments('id').primary();
          table.string('title', 50).notNullable();
          table.string('thumbnail', 40).notNullable();
          table.integer('price').notNullable();
        })
    })
  }

  insertar(data) {
    if (data.title === "" || typeof data.title === "undefined") return false;
    if (data.price === "" || typeof data.price === "undefined") return false;
    if (data.thumbnail === "" || typeof data.thumbnail === "undefined") return false;
    return this.knex('productos').insert(data);
  }

  listar() {
    return this.knex('productos').select();
  }

  select(id) {
    return this.knex('productos').where({ id: id })
  }

  actualizar(id, data) {
    return this.knex('productos').where({ id: id }).update(data);
  }

  borrarPorId(id) {
    return this.knex.from('productos').where('id', id).del();
  }
}

export default ProductsDB;