const gm = require('gm').subClass({ imageMagick: true });
const aws = require('aws-sdk');

const root    = process.env['LAMBDA_TASK_ROOT'];
const path    = process.env['PATH'];
const libPath = process.env['PATH'];

// change the Lambda Runtime to use pre-built binary
process.env['PATH']            = `${root}/bin:${path}`;
process.env['LD_LIBRARY_PATH'] = `${root}/lib:${libPath}`;

// convert HEIC to JPEG
exports.handler = (event, context, callback) => {

  if (event.img.startsWith("s3://")) {
    let s3 = new aws.S3();


    let s3_parts = event.img.slice("s3://".length).split("/");
    let s3_bucket = s3_parts[0];
    let s3_original_key =  s3_parts.slice(1).join('/');


    let s3_original_object = {
      Bucket    : s3_bucket,
      Key    : s3_original_key
    };

    let converted_key = s3_original_key.replace(".HEIC", ".x.JPEG");


    let gm_object = s3.getObject(s3_original_object).createReadStream();
    console.log("Have gm_object!");
    let gm_stream = gm(gm_object)
        .toBuffer('JPEG',function (err, buffer) {
          if (err) {
            console.error(err);
            return;

          }

          let s3_new_object = {
            Bucket: s3_bucket,
            Key: converted_key,
            Body: buffer
          };

          s3.putObject(s3_new_object, function(err, data) {
            if (err) {
              console.log("Well crap")
              console.error(err);
              return;
            }
            //S3 put response...
            console.log("ALL DONE");
            console.log(data);
          });


        })







  } else {
    let [path] = event.img.split('.');
    gm(event.img).write(`${path}.jpeg`, (err) => console.error(err));
  }
};
