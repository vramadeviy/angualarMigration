import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[allowAlphNumericOnly]'
})
// export class NumberOnlyDirective {

//     private regex: RegExp = new RegExp(/^-?[A-Za-z0-9-]+(\.[A-Za-z0-9-]*){0,1}$/g);

//     constructor(private el: ElementRef) {
//     }
//     @HostListener('keydown', ['$event'])
//     onKeyDown(event: KeyboardEvent) {

//         let current: string = this.el.nativeElement.value;
//         let next: string = current.concat(event.key);
//         if (next && !String(next).match(this.regex)) {
//             event.preventDefault();
//         }
//     }
// }
export class NumberOnlyDirective {

    private regex: RegExp = new RegExp(/^-?[A-Za-z0-9-]+(\.[A-Za-z0-9-]*){0,1}$/g);
    @HostListener('keyup') onKeyUp() {
        this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  
      }
    constructor(private el: ElementRef) {
        this.el.nativeElement.onkeypress=(event: KeyboardEvent)=> {
            let current: string = this.el.nativeElement.value;
            let next: string = current.concat(event.key);
            if (next && !String(next).match(this.regex)) {
                event.preventDefault();
            }
        }
    }

}
