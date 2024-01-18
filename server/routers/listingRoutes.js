import express from "express";
import { addListing, deleteListing, getListing, getListings, updateListing } from "../controllers/listingController.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/", getListings);
router.get("/:id", getListing);
// router.get('/defaultImg')
router.post("/add", upload.single('image'), addListing);
router.put("/update/:id", upload.single('image'),updateListing);
router.delete("/delete/:id", deleteListing);

export default router;