/* Ideas derived from github.com/easy-json-schema/easy-json-schema */

let fs = require('fs');

function generateSchema(file)
{
  let schema = {};
  parse(file, schema);
  return schema;
}

function parseObject(obj, schema) {
  schema.type = 'object';
  schema.required = [];
  let subSchema = schema.properties = {};
  for (let key in obj) {
    let item = obj[key];
    let subSubSchema = subSchema[key] = {};
    parse(item, subSubSchema);
  }
}

function parseArray(arr, schema) {
  schema.type = 'array';
  if (arr.length !== 0) {
    let subSchema = schema.items = {};
    parse(arr[0], subSchema);
  }
}

function parse(json, schema) 
{
  if (Object.prototype.toString.call(json) === '[object Array]') {
    parseArray(json, schema);
  } else if (Object.prototype.toString.call(json) === '[object Object]') {
    parseObject(json, schema);
  } else {
    schema.type = typeof json;
  }
}

fs.readFile(process.argv.slice(2)[0], 'utf8', function (err, data) {
  if (err) throw err;
  let obj = JSON.parse(data);
  fs.writeFile("./root-schema.json", JSON.stringify(generateSchema(obj), null, 2), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });
});