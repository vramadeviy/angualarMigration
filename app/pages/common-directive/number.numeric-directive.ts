import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[numericOnly]'
})
export class NumbersDirective {

    constructor(public el: ElementRef) {

        this.el.nativeElement.onkeypress = (evt) => {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        };
    }
}