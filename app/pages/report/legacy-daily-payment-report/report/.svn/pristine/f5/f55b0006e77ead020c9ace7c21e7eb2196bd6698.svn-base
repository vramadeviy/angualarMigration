import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';


// validation function
function validateJuriNameFactory(): ValidatorFn {
    return (c: AbstractControl) => {
        var date_regex = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
        if (date_regex.test(c.value)) {
            var today: any = new Date();
            var dd: any = today.getDate();
            var mm: any = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var today: any = mm + '/' + dd + '/' + yyyy;
            if (new Date(today) >= new Date(c.value)) {
                return null;
            } else {
                return {
                    validateDate: {
                        valid: false
                    }
                }
            }
        }else{
            return {
                validateDate: {
                    valid: false
                }
            }
        }


    }
}


@Directive({
    selector: '[validateDate][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DateValidator, multi: true }
    ]
})
export class DateValidator implements Validator {
    validator: ValidatorFn;

    constructor() {
        this.validator = validateJuriNameFactory();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

}