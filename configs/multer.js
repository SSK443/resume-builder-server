

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && allowedTypes.test(ext)) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

export default upload;


// // configs/multer.js

// import multer from "multer";
// import path from "path";
// // fs is no longer needed
// // import fs from "fs";

// // REMOVED: All code related to 'fs' and 'uploadDir'
// // Vercel has a read-only filesystem

// // 1. Use memoryStorage instead of diskStorage
// // This holds the file in RAM (memory) as a 'buffer'
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage, // 2. Use the new memoryStorage
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     // 3. Keep your file filter logic, it is correct
//     const allowedTypes = /jpeg|jpg|png|webp/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (mimetype && allowedTypes.test(ext)) {
//       return cb(null, true);
//     }
//     cb(new Error("Only images are allowed"));
//   },
// });

// export default upload;