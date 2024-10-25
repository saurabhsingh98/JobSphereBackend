
import multer from "multer";

const storage= multer.memoryStorage();

export const singleUpload= multer({storage}).single('file');

// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "../01_public")
//     },
//     filename: function (req, file, cb) {
      
//       cb(null, file.originalname)
//     }
//   })

  
// export const upload = multer({ 
//     storage, 
// })