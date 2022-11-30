// SET STORAGE
const multer = require('multer');
const csvToJson = require('convert-csv-to-json');
// const CsvFile = require('../model/csv_model');
const fs = require('fs');
    var iconv = require('iconv-lite');
    const Papa = require('papaparse');
const uploadedFileNames = []; 
module.exports.uploadedFileNames = function(){
    return uploadedFileNames;
  } 

path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var fileFilter = function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.csv') {
        console.log('file is not csv type')
        return callback(new Error('Only csv format files are allowed'))
    }
    callback(null, true)
}

var upload = multer({ storage: storage,
    fileFilter : fileFilter
}).single('uploaded_file');

module.exports.upload = function (req, res) {
    console.log('req.files',req.files)
    console.log("inside multer");
    console.log(path.join(__dirname,'../uploads'));
    upload(req, res, (err) => {
        console.log("inside multer2");
        const file = req.file
        if(err){
            console.log('err',err);
            return res.redirect('/');
        }
        // console.log(path.extname(files.originalname));
        // if (!files) {
        //     const error = new Error('Please choose files')
        //     error.httpStatusCode = 400;
        //     console.log(error);
        //     return res.redirect('/');
        // }
        // CsvFile
        console.log('req.file.filename',req.file.filename)
        uploadedFileNames.push(req.file.filename);
        console.log('uploadedFileNamesArray',uploadedFileNames)
        return res.redirect('/');
        // if(file){
        //     var obj = {
        //         name: req.file.filename,
        //         csvFile: {
        //             data: fs.readFileSync(path.join(__dirname, '../uploads' , req.file.filename)),
        //             contentType: 'csv'
        //         }
        //     }
        //     CsvFile.create(obj, (err, item) => {
        //         if (err) {
        //             console.log(err);
        //         }
        //         else {
        //             // item.save();
        //             res.redirect('/');
        //         }
        //     });
        }
    )
}


//for opening the csv file and display its content in a tabular form
module.exports.open =async function(req,res){
    const csvParsedData = [];              //array which stores the data in JSON format
    const id = req.query.id;
    const pathOfFile = path.join(__dirname,'../uploads',uploadedFileNames[id]);
    // imgModel.find({}, (err, items) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(500).send('An error occurred', err);
    //     }
    //     else {
    //         res.render('imagesPage', { items: items });
    //     }
    // });
   // read csv file and get buffer
//    638552c80e9bf56d207d8bf3
//    let csvFildData = await CsvFile.findById(id);
//    console.log('csvFildData',csvFildData);
//    console.log('end of csvFildData')
//    let csvFilebytes = csvFildData.csvFile.data.toString('base64')
   const buffer = fs.readFileSync(pathOfFile);
    // const buffer = fs.readFileSync(csvFilebytes);
    console.log('buffer',buffer);
   // parse buffer to string with encoding
   let dataString = iconv.decode(buffer, 'win1251'); 
   console.log('dataString',dataString)  ;
   
   // parse string to array of objects
   let config = {
       header: true,
       dynamicTyping: true,
       step: function(row) {
		console.log("Row:", row.data);
        jsonDa = row.data;
        console.log('row',row);
        console.log('jsonDa',jsonDa);
        // jsonData.pop();
        return res.render('tabular-data-view',{
        title: "csv project",
        jsonData:jsonDa
    })
	},
	complete: function() {
		console.log("All done!");
	}
       
   };
   const parsedOutput = Papa.parse(dataString, config);
//    console.log('parsedOutput: ', parsedOutput);
   console.log('parsedOutput: ', parsedOutput.data);
   
   
    // let jsonData = csvToJson.parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    jsonData = csvToJson.utf8Encoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    console.log('jsonData',jsonData);
    // jsonData = csvToJson.ucs2Encoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    // jsonData = csvToJson.utf16leEncoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    // jsonData = csvToJson.latin1Encoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    // jsonData = csvToJson.asciiEncoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    // jsonData = csvToJson.base64Encoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    // jsonData = csvToJson.hexEncoding().parseSubArray('"',',').fieldDelimiter(',').formatValueByType().getJsonFromCsv(pathOfFile);
    // console.log('jsonData',jsonData);
    console.log('jsonDatavalue',jsonData);
    jsonData = parsedOutput.data;
    for(let i=0; i<jsonData.length;i++){
        console.log(jsonData[i]);
        currObj = jsonData[i];
        for (const property in currObj) {
            console.log(`${property}: ${currObj[property]}`);
          }
    }
    jsonData.pop();
    // console.log('upload started');
    // let datassString = JSON.parse(jsonData)
    // let finalResult = await CsvFile.findByIdAndUpdate(id, {jsonObj : datassString});
    // console.log('upload ended');
    return res.render('tabular-data-view',{
        title: "csv project",
        jsonData:jsonData
    })
  }