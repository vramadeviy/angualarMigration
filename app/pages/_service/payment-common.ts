import { isArray } from "util";


export class HelperCommonMethod {

    constructor(){

    }
    /**
     * 
     * @method resetNGModalValue
     * @param {any} resetObject 
     * @memberof HelperCommonMethod
     */
    resetNGModalValue(ngModal) {
        for (let key in ngModal) {
            if (isArray(ngModal[key])) {
                ngModal[key] = [];
            }
            else {
                ngModal[key] = "";
            }
        }
    }   
}