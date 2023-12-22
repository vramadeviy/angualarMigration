import {NgbDateStruct} from  './ngbDateStruct'

export abstract class NgbDateParserFormatter {

    abstract parse(value: string): NgbDateStruct;
  
   
    abstract format(date: NgbDateStruct): string;
  }