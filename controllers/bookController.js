const BookModel = require('../models/bookModel.js');
const AuthorModel = require('../models/authorModel.js');
const UserModel = require('../models/usermodel.js');
const {isValidDate} = require('../utils/datevalidator.js');

exports.create = async (req, res) => {

    //JSON checker
    if (!req.is('application/json')) {
        return res.status(400).json({
            message: "Invalid content type. Expected application/json",
            data: null
        });
    }

    const allowedFields = ['title', 'description', 'published_date', 'author_id', 'created_by'];
    const data = {};
    const missingFields = [];

    for (const field of allowedFields) {
        if (!req.body[field]) {
            missingFields.push(field);
        } else {
            data[field] = req.body[field];
        }
    }

    if (missingFields.length > 0) {
    return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        data: null
    });
    }

    if (!isValidDate(data['published_date'])) {
        return res.status(400).json(
            { 
                message: "Published date must be in format YYYY-MM-DD and valid." ,
                data: null
            });
    }

    try{
        
        const existingAuthor = await AuthorModel.findById(data['author_id']);
        console.log(existingAuthor);
        if(!existingAuthor){
            return res.status(404).json(
                { 
                    message: "Author did not exist" ,
                    data: null
                }
            );
        }

        const existingUserAdmin = await UserModel.findById(data['created_by']);
        console.log(existingUserAdmin);
        if(!existingUserAdmin){
            return res.status(404).json(
                { 
                    message: "Admin did not exist" ,
                    data: null
                }
            );
        }

        await BookModel.createBook(data);
        return res.status(201).json({
            message: "Book registered successfully",
            data: null
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.getAllBook = async(req, res) =>{
    let { page = 1, limit = 3 } = req.query;

    // Convert ke integer dan pastikan valid
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({
            message: "Invalid pagination parameters.",
            data: null,
        });
    }

    const offset = (page - 1) * limit;
    try {
        const books = await BookModel.getPaginatedBooks(limit, offset);
        const totalCount = await BookModel.getBooksCount();

        return res.status(200).json({
            message: "Books retrieved successfully",
            data: {
                books,
                pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
                }
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            data: null
        });
    }
}

exports.edit = async (req, res) =>{
    //JSON checker
    if (!req.is('application/json')) {
        return res.status(400).json({
            message: "Invalid content type. Expected application/json",
            data: null
        });
    }

    // Input validation
    const allowedFields = ['title', 'description', 'published_date', 'author_id', 'created_by'];
    const fieldsToUpdate = {};

    for (const field of allowedFields) {
        if (req.body[field]) {
            fieldsToUpdate[field] = req.body[field];
        }
    }

    const {id} = req.params;

    const existingBook = await BookModel.findById(id);
    if(!existingBook){
        return res.status(404).json(
            { 
                message: "Book not found" ,
                data: null
            }
        );
    }

    const existingAuthor = await AuthorModel.findById(fieldsToUpdate['author_id']);
    console.log(existingAuthor);
    if(!existingAuthor){
        return res.status(404).json(
            { 
                message: "Author not found" ,
                data: null
            }
        );
    }

    const existingUserAdmin = await UserModel.findById(fieldsToUpdate['created_by']);
    console.log(existingUserAdmin);
    if(!existingUserAdmin){
        return res.status(404).json(
            { 
                message: "Admin not found" ,
                data: null
            }
        );
    }
    const data = {id, ...fieldsToUpdate};
    console.log(data);
    try{
        const result = await BookModel.editBook(data);
        // console.log(result);
        // console.log(JSON.stringify(result, null, 2));
        return res.status(201).json({
            message: "Book updated successfully",
            data: result
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }

}

exports.delete = async (req,res) =>{
    const {id} = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json(
            { 
                message: 'Invalid book ID', 
                data: null 
            }
        );
    }

    const existingBook = await BookModel.findById(id);
    if (!existingBook) {
    return res.status(404).json(
            { 
                message: "Book not found" ,
                data: null
            }
        );
    }
}