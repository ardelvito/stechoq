const pool = require('../config/db');

class BookModel {

    //Get all book function
    static async getAllBook(){
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT b.*, a.name, u.name FROM books b INNER JOIN authos a on b.author_id = a.id INNER JOIN users u on u.id = b.created_by;');
        conn.release();
        return result[0];
    }

    // Add new book
    static async createBook(data) {
        const conn = await pool.getConnection();
        const query = `
            INSERT INTO books (title, description, published_date, author_id, created_by)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.title,
            data.description,
            data.published_date,
            data.author_id,
            data.created_by
        ];

        const result = await conn.query(query, values);
        console.log(query)
        console.log(values)
        console.log(result);
        return Number(result.insertId);
    }

    static async getPaginatedBooks(limit, offset){
        const conn = await pool.getConnection();
        const rows = await conn.query(
            'SELECT * FROM books LIMIT ? OFFSET ?',
            [limit, offset]
        );
        conn.release();
        console.log(rows);

        return rows;
    }

    static async getBooksCount() {
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT COUNT(*) as count FROM books');
        conn.release();
        console.log(Number(result['count']));
        return result['count'];
    }

    static async editBook(data)
    {
        const { id, ...fieldsToUpdate } = data;

        if (!id) {
            throw new Error('Books ID is required for update');
        }

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) {
            throw new Error('No data provided for update');
        }
        console.log(`keys: ${keys}`);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        // console.log(`setClause: ${setClause}`);

        const values = keys.map(key => fieldsToUpdate[key]);
        // console.log(`values: ${values}`);


        const query = `UPDATE Books SET ${setClause} WHERE id = ?`;
        values.push(id);
        // console.log(`query: ${query}`);

        const conn = await pool.getConnection();
        const packet = await conn.query(query, values);
        console.log('Query result:', packet);

        const cleanPacket = JSON.parse(
        JSON.stringify(packet, (key, value) =>
            typeof value === 'bigint' ? Number(value) : value
        )
        );

        console.log("Update result:");
        console.log(cleanPacket);


        // console.log(cleanPacket);
        // console.log(result);
        return cleanPacket;

    }

    static async deleteBookById(id){
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM books WHERE id = ?', [id]);
        conn.release();
        // console.log(result);
        return result[0];
    }

    static async findById(id){
        const conn = await pool.getConnection();
        const result = await conn.query('SELECT * FROM books WHERE id = ?', [id]);
        conn.release();
        return result[0];
    }



}

module.exports = BookModel;