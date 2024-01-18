import express from "express";
import mysql from "mysql";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
});

export const getListings = (req, res) => {
    const sql = "SELECT * FROM `listings`";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' })
        }

        return res.json(result);
    })
}

export const getListing = (req, res) => {
    const sql = "SELECT * FROM `listings` WHERE `id` = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' })
        }

        return res.json(result);
    })
}

const validateData = (formData) => {
    const errors = {};

    // Example validation rules
    if (!formData.name) {
        errors.name = 'Name is required';
    }

    if (!formData.location) {
        errors.location = 'Location is required';
    }

    if (isNaN(formData.bedroom) || formData.bedroom <= 0) {
        errors.bedroom = 'Bedroom should be a positive number';
    }

    if (isNaN(formData.bath) || formData.bath <= 0) {
        errors.bath = 'Bath should be a positive number';
    }

    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        errors.price = 'Price should be a positive number';
    }

    if (formData.status === 'select') {
        errors.status = 'Status is required';
    }

    return errors;
};

export const addListing = (req, res) => {
    const validationErrors = validateData(req.body);
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }
    
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = req.file.filename;

    const sql = "INSERT INTO `listings`(`name`, `location`, `price`, `bedroom`, `bath`, `status`,`image`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.location,
        req.body.price,
        req.body.bedroom,
        req.body.bath,
        req.body.status,
        image
    ]

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' })
        }

        return res.json(result);
    })
}

export const updateListing = (req, res) => {
    const id = req.params.id;
    const image = req.file ? req.file.filename : null;

    if (req.file) {
        const sqlSelect = "SELECT `image` FROM `listings` WHERE `id` = ?";
        db.query(sqlSelect, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Server Error' })
            }
            
            if (image != result[0].image) {
                const imgPath = path.join(__dirname, '../public/images', result[0].image);
                fs.unlinkSync(imgPath);

                const sqlUpdate = "UPDATE `listings` SET `name` = ?, `location` = ?, `price` = ?, `bedroom` = ?, `bath` = ?, `status` = ?, `image` = ? WHERE `id` = ?";
                const values = [
                    req.body.name,
                    req.body.location,
                    req.body.price,
                    req.body.bedroom,
                    req.body.bath,
                    req.body.status,
                    image,
                ]
                db.query(sqlUpdate, [...values, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: 'Server Error' });
                    }

                    return res.json(result);
                });
            } else {
                return res.json(result);
            }
        })
    } else {
        const sqlUpdate = "UPDATE `listings` SET `name` = ?, `location` = ?, `price` = ?, `bedroom` = ?, `bath` = ?, `status` = ? WHERE `id` = ?";
        const values = [
            req.body.name,
            req.body.location,
            req.body.price,
            req.body.bedroom,
            req.body.bath,
            req.body.status,
        ]

        db.query(sqlUpdate, [...values, id], (err, updateResult) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Server Error' });
            }
    
            const sqlSelectUpdated = "SELECT * FROM `listings` WHERE `id` = ?";
            db.query(sqlSelectUpdated, [id], (err, selectResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Server Error' });
                }
    
                return res.json(selectResult);
            });
        });
    }
}

export const deleteListing = (req, res) => {
    const id = req.params.id;

    const sqlSelect = "SELECT `image` FROM `listings` WHERE `id` = ?";
    db.query(sqlSelect, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Server Error' })
        }

        const deleteImage = result[0].image;

        const sqlDelete = "DELETE FROM `listings` WHERE `id` = ?";
        db.query(sqlDelete, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Server Error' })
            }

            if (deleteImage) {
                const imgPath = path.join(__dirname, '../public/images', deleteImage);
                fs.unlinkSync(imgPath, (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: 'Server Error' })
                    }
                });
            }

            return res.json(result);
        })
    })
}