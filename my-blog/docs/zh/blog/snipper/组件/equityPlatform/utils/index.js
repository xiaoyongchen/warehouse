const XLSX = require('xlsx')
/*
    * 导出 excel 文件
    * @param array JSON 数组
    * @param sheetName 第一张表名
    * @param fileName 文件名
*/
export function downloadSheetTemplate (array, sheetName = '表1', fileName = 'example.xlsx') {
  const jsonWorkSheet = XLSX.utils.json_to_sheet(array)
  const workBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet
    }
  }
  return XLSX.writeFile(workBook, fileName)
}
