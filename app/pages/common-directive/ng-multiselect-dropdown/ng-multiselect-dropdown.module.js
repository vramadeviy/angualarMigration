import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from './multiselect.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { ListFilterPipe } from './list-filter.pipe';
var Ng2MultiSelectDropDownModule = (function () {
    function Ng2MultiSelectDropDownModule() {
    }
    Ng2MultiSelectDropDownModule.forRoot = function () {
        return {
            ngModule: Ng2MultiSelectDropDownModule
        };
    };
    return Ng2MultiSelectDropDownModule;
}());
export { Ng2MultiSelectDropDownModule };
Ng2MultiSelectDropDownModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [MultiSelectComponent, ClickOutsideDirective, ListFilterPipe],
                exports: [MultiSelectComponent]
            },] },
];
/** @nocollapse */
Ng2MultiSelectDropDownModule.ctorParameters = function () { return []; };
//# sourceMappingURL=ng-multiselect-dropdown.module.js.map