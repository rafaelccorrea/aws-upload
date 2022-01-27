import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from "aws-sdk"

const s3 = new aws.S3();

s3.putObject({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  ACL: 'public-read'
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
      cb(null, '../../../../temp')
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})

const multerS3Config = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname)
  }
});

const upload = multer({
  storage: multerS3Config,
  fileFilter: fileFilter,
  limits: {
      fileSize: 1024 * 1024 * 5
  }
})

export default upload;
