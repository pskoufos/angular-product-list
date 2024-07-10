import { RouterOutlet } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { procuctModel } from './models/product';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, NgFor, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'products-list';
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(';');
      if (curruntRecord.length == headerLength) {
        let csvRecord: procuctModel = new procuctModel;
        csvRecord.cat1 = curruntRecord[0].trim();
        csvRecord.cat2 = curruntRecord[1].trim();
        csvRecord.descr = curruntRecord[2].trim();
        csvRecord.brand = curruntRecord[3].trim();
        csvRecord.info = curruntRecord[4].trim();
        csvRecord.price = curruntRecord[5].trim();
        csvRecord.tags = curruntRecord[6].trim();
        csvRecord.stars = curruntRecord[7].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(';');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }


  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }
}