const AuthorModel = require('../models/authorModel.js');
const {isValidDate} = require('../utils/datevalidator.js');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

exports.create = async (req, res) => {

    //JSON checker
    if (!req.is('application/json')) {
        return res.status(400).json({
            message: "Invalid content type. Expected application/json",
            data: null
        });
    }

    const allowedFields = ['name', 'biography', 'birth_date'];
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

    if (!isValidDate(data['birth_date'])) {
        return res.status(400).json(
            { 
                message: "Birth date must be in format YYYY-MM-DD and valid." ,
                data: null
            });
    }

    try{
        // console.log(data['name']);
        const existingAuthor = await AuthorModel.findByName(data['name']);
        console.log(existingAuthor);
        if(existingAuthor){
            return res.status(409).json(
                { 
                    message: "Author already exist" ,
                    data: null
                }
            );
        }
        await AuthorModel.createAuthor(data);
        return res.status(201).json({
            message: "Author registered successfully",
            data: null
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.edit = async (req, res) => {
    //JSON checker
    if (!req.is('application/json')) {
        return res.status(400).json({
            message: "Invalid content type. Expected application/json",
            data: null
        });
    }

    // Input validation
    const allowedFields = ['name', 'biography', 'birth_date'];
    const fieldsToUpdate = {};

    for (const field of allowedFields) {
        if (req.body[field]) {
            fieldsToUpdate[field] = req.body[field];
        }
    }

    // Check if at least one field is provided
    if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({
        message: "Please provide required fields",
        data: null
    });
    }

    const {id} = req.params;

    const existingAuthor = await AuthorModel.findById(id);
    if (!existingAuthor) {
    return res.status(404).json(
            { 
                message: "Author not found" ,
                data: null
            }
        );
    }

    const birth_date = fieldsToUpdate['birth_date'];

    if(birth_date){
        if (!isValidDate(birth_date)) {
            return res.status(400).json(
                { 
                    message: "Birth date must be in format YYYY-MM-DD and valid." ,
                    data: null
                }
            );
        }
    }

    const data = {id, ...fieldsToUpdate};
    console.log(data);
    try{
        const result = await AuthorModel.editAuthor(data);
        console.log(result);
        return res.status(201).json({
            message: "Author updated successfully",
            data: null
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.delete = async (req, res) => {

    const {id} = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json(
            { 
                message: 'Invalid author ID', 
                data: null 
            }
        );
    }

    const existingAuthor = await AuthorModel.findById(id);
    if (!existingAuthor) {
    return res.status(404).json(
            { 
                message: "Author not found" ,
                data: null
            }
        );
    }

    try{
        await AuthorModel.deleteAuthorById(id);
        // console.log(result);
        return res.status(200).json({
            message: "Author deleted successfully",
            data: null
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.viewall = async (req, res) =>{

}