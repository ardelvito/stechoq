const pool = require('../config/db');

class AuthorModel {
    static async createAuthor(data)
    {
        const conn = await pool.getConnection();
        const result = await conn.query(
            'INSERT INTO authors (name, biography, birth_date) VALUES (?, ?, ?)', 
            [data.name, data.biography, data.birth_date]
        );
        conn.release();
        console.log(Number(result.insertId));
    }

    static async editAuthor(data)
    {
        const { id, ...fieldsToUpdate } = data;

        if (!id) {
            throw new Error('Author ID is required for update');
        }

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) {
            throw new Error('No data provided for update');
        }
        console.log(`keys: ${keys}`);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        console.log(`setClause: ${setClause}`);

        const values = keys.map(key => fieldsToUpdate[key]);
        console.log(`values: ${values}`);


        const query = `UPDATE authors SET ${setClause} WHERE id = ?`;
        values.push(id);
        console.log(`query: ${query}`);

        const conn = await pool.getConnection();
        const result = await conn.query(query, values);
        conn.release();

        return result;
    }



    static async findById(id){
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM authors WHERE id = ?', [id]);
        conn.release();
        return result[0];
    }

    static async findByName(name){
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM authors WHERE name = ?', [name]);
        conn.release();
        // console.log(result);
        return result[0];
    }

    static async deleteAuthorById(id){
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM authors WHERE id = ?', [id]);
        conn.release();
        console.log(result);
        return result[0];
    }

    static async viewAllAuthor(){
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM authors');
        conn.release();
        console.log(result);
        return result[0];
    }
}

module.exports = AuthorModel;