import {Component,ElementRef,ViewChild,Input,Output,EventEmitter} from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Component({
  selector: 'ngb-datepicker-popup',
  host: {
        '(document:click)': 'handleOutsideClick($event)',
    },
  templateUrl: './datepicker-popup.html',
  styles:['.ngbDatepicker-wrapper ngb-datepicker.dropdown-menu{top:31px !important}']
})
export class NgbDatepickerPopup {
  @Input() selectedDateKey;
  @Input() disabled:boolean=false;
  @Input() required:boolean=false;
  @Input() controlName: any;
  @ViewChild('dp') dp;
  @Input() tabIndex:any;
  @Input() minDateKey:any;
  @Input() maxDateKey:any;
  datePickerKey={}
//    @Input() selectedDateKey:any = {}

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  dynamicId;
  onClick(e){
    this.dp.open();
    this.dynamicId = e;
  }
  constructor(private _eref: ElementRef) {
    
   }
   ngOnInit() {
    if(typeof this.selectedDateKey =="object"){
      this.selectedDateKey=this.selectedDateKey['month']+'/'+this.selectedDateKey['day']+'/'+this.selectedDateKey['year'];
    }
  
  }   
  ngOnChanges(date) {
    let  selectedDate=new Date(this.selectedDateKey);
    if(typeof this.minDateKey=='string'){
      const date=new Date(this.minDateKey);
      this.minDateKey={ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    if(typeof this.maxDateKey=='string'){
      const date=new Date(this.maxDateKey);
      this.maxDateKey={ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    if(typeof this.selectedDateKey=='string'){
      const date=new Date(this.selectedDateKey);
      this.datePickerKey={ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    }
    // if(selectedDate>this.minDateKey){
    //   const date=new Date();
    //   this.minDateKey={ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() };
    // }
  } 
  opendbPicker(e){  
    this.onClick(e);
    
  }
 
  clearNGModel(){
      this.selectedDateKey=null;
      this.datePickerKey={};
    
  }
  toggleNgDatepicker(db){
    db.toggle();
    this.dynamicId = db;
   }
  handleOutsideClick(e){
      //console.log(event);
      if(this.dynamicId == undefined){
      }
      else if(!this._eref.nativeElement.contains(event.target)) {
        let self = this;
        setTimeout(function(){
          self.dynamicId.close();    
        },10);
      }
  
    }
    onDateChange(dt: any) {
      if(typeof dt=='object'){
        this.selectedDateKey=dt['month']+'/'+dt['day']+'/'+dt['year'];
        this.notify.emit(dt.month+'/'+ dt.day+'/'+ dt.year);
      }else{
        this.notify.emit(dt);
      }
     
    }
  }
