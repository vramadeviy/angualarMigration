import { Directive, Input, Output, OnInit } from "@angular/core";
import { EventEmitter } from "protractor";

@Directive({
    selector: '[uppercase]',
    host: {
        '[value]': 'uppercase',
        '(input)': 'format($event.target.value)'
    }
})
export class Uppercase implements OnInit {

    @Input() uppercase: string;
    @Output() uppercaseChange: EventEmitter= new EventEmitter();

    constructor() {
    }

    ngOnInit() {
        this.uppercase = this.uppercase || '';
        this.format(this.uppercase);
    }

    format(value) {
        value = value.toUpperCase();
        this.uppercaseChange.emit(value);
    }
}