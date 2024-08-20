import multer from "multer";

//to handel file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp"); 
        // a temp files is stored in this temp folder till it is uploaded on cloudinary
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage: storage })