import knex from 'knex'

class MensajesDB {
  constructor(config) {
    this.knex = knex(config)
  }

  crearTabla() {
    return this.knex.schema.dropTableIfExists('mensajes')
      .then(() => {
        return this.knex.schema.createTable('mensajes', table => {
          table.increments('id').primary();
          table.string('usuario', 50).notNullable();
          table.string('texto', 255).notNullable();
          table.string('fecha');
        })
    })
  }

  insertar(mensaje) {
    return this.knex('mensajes').insert(mensaje);
  }

  listar() {
    return this.knex('mensajes').select();
  }

  borrarPorId(id) {
    return this.knex.from('mensajes').where('id', id).del();
  }

  cerrar() {
    return this.knex.destroy();
  }

}

export default MensajesDB