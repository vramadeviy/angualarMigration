import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumbersDirective } from './number.numeric-directive';
import { FocusDirective } from './auto-focus-directive';



@NgModule({
    imports: [
        CommonModule,
        NgbModule,
    ],
    declarations: [
        NumbersDirective,
        FocusDirective
    ],
    exports: [NumbersDirective,FocusDirective]
})

export class CommonDirectivepModule { }
