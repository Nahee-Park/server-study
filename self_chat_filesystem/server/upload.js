const router = require("express").Router();
const multer = require("multer");
const AdmZip = require("adm-zip");
const fs = require("fs");
const rimraf = require("rimraf");

// 주소 맵핑 다시 필요
const upload = require("../server/file/upload");

// 업로드 될 때 실행되는 POST
router.post("/post", async (req, res, next) => {
  try {
    // 파일 저장, 압축 풀기
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return next(err);
      } else if (err) {
        return next(err);
      }
      // 파일 위치로 AdmZip 생성 => 압축 해제
      const filePath = req.file.path;
      const zip = new AdmZip(filePath);
      // 압축 해제될 위치 지정
      const target = "./upload/" + req.session.user.id;

      // 폴더 삭제하고 생성하기
      rimraf.sync(target);
      zip.extractAllTo(target, true);

      return res.json(true);
    });
  } catch (err) {
    console.err(err);
  }
});
// 파일의 내용을 얻어오는 GET
router.get("/contents", async (req, res, next) => {
  try {
    const { filename } = req.query;
    const contents = fs.writeFileSync(
      "./upload/" + req.session.user.id + "/" + filename,
      contents,
      "utf8"
    );
    res.send(contents);
  } catch (err) {
    console.err(err);
  }
});
// 파일의 내용을 변경하는 POST
router.post("/contents", async (req, res, next) => {
  try {
    const { filename, contents } = req.body;

    fs.writeFileSync(
      "./upload" + req.session.user.id + "/" + filename,
      contents,
      "utf8",
      (error) => {
        console.log("write end");
      }
    );

    res.send(true);
  } catch (err) {
    console.err(err);
  }
});

module.exports = router;
