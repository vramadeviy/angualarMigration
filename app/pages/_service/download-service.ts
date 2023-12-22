import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DownloadService {

  reportName='payment-lookup.csv';
  constructor() { }



  public ConvertToCSV(objArray, headerList) {

    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = 'S.No,';

    for (var index in headerList) { //objArray[0]
      //Now convert each value to string and comma-separated
      row += headerList[index].item_text + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = (i + 1) + '';
      for (var index in headerList) {//array[i]
        let head = headerList[index].item_id;
        //if (line != '') line += ','
        var rowValue= array[i][head];
        var getRowData = rowValue ? '" ' + rowValue + '"' : "";
        
        line += ',' + getRowData;

      }
      str += line + '\r\n';
    }
    return str;
  }
  public getBlobCSVData(csvObject) {
    let blob = new Blob([csvObject], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = window.URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, this.reportName);
    }else{
      if (isSafariBrowser) { //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
      }
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", this.reportName);
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
    }
    
  }


  updateFileName(name){
    this.reportName=name;
  }

}   
