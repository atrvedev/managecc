import XLSX from "xlsx";
import axios from "axios";
import { message } from "antd";
//startline: số dòng bắt đầu đọc
//arrkey: Mảng key mapping tới server
const ExcelToJson = (file, startLine, arrKey) => {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();
      let result = {};

      reader.onload = function (e) {
        let data = e.target.result;
        data = new Uint8Array(data);
        let workbook = XLSX.read(data, { type: "array" });

        console.log(workbook);

        let result = {};
        workbook.SheetNames.forEach(function (sheetName, index) {
          let roa = XLSX.utils.sheet_to_row_object_array(
            workbook.Sheets[sheetName],
            {
              header: 1,
            }
          );
          if (roa.length > 0) {
            result = roa;
          }
        });
        //console.log(attrTypes);
        let arr = [];
        for (let i = startLine; i < result.length; i++) {
          let obj = result[i];
          //console.log(obj);
          let jsonObject = {};
          for (let key in obj) {
            // let attrName = result[0][key];
            let attrName = arrKey[key];
            if(!attrName) {
              attrName = result[0][key]
            }
            let attrValue = obj[key];

            jsonObject[attrName] = attrValue;
          }
          arr.push(jsonObject);
        }
        //   // see the result, caution: it works after reader event is done.
        //   console.log(result);
        resolve(arr);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }

    //reader.readAsBinaryString(file)
  });
};

const queryParams = (params) => {
  let query = "";
  params.forEach((param, index) => {
    let strQuery = Object.keys(param)
      .map(
        (k) =>
          encodeURIComponent(`request[${index}].${k}`) +
          "=" +
          encodeURIComponent(param[k])
      )
      .join("&");
    query += `${strQuery}&`;
  });

  return query;
};


export { ExcelToJson };
