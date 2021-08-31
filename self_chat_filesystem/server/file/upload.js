const multer = require("multer");
const storage = multer.diskStorage({
  // 파일 저장 경로
  destination: (req, file, cb) => {
    cb(null, "src/files/");
  },
  //   저장되는 파일명
  filename: (req, file, cb) => {
    cb(null, req.session.user.id + "_" + file.originalname);
  },
});

// 하나의 파일 업로드 하므로 single
const upload = multer({ storage: storage }).single("file");

module.exports = upload;
