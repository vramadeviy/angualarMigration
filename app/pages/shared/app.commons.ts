

export class AppCommons {
    constructor() { }

    getMultiselectionDropDownSettings(isSingleSelection, idField, data, text, selectAllText, unselectAllText, limit = 1, isSearchFilter = false) {
        return {
            singleSelection: isSingleSelection,
            idField: idField,
            data: idField,
            textField: text,
            selectAllText: selectAllText,
            unselectAllText: unselectAllText,
            itemsShowLimit: limit,
            allowSearchFilter: isSearchFilter
        }
    }

 
    getObjectToArray(object, key) {
        let optionList = [];
        if (object.length) {
            object.map(item => {
                optionList.push(item[key]);
            })
        }
        return optionList;
    }

    getObjectToString(object, key) {
        let optionList = [];
        if(typeof object==="object"){
            if (object.length) {
                object.map(item => {
                    optionList.push(item[key]);
                })
            }
            return optionList.toString();
        }else{
            return object;
        }
       
    }
    showLoadingIocn() {
        document.getElementById("spinner_loader").style.display = "block";
        document.getElementById("spinner_loader").style.opacity = "1";
        document.getElementById("spinner_loader").style.visibility = "visible";
    }
    hideLoadingIcon() {
        document.getElementById("spinner_loader").style.display = "none";
        document.getElementById("spinner_loader").style.opacity = "0";
        document.getElementById("spinner_loader").style.visibility = "invisible";
    }
    setPreviousDefaultDate() {
        let newtDate = new Date();
        newtDate.setDate(newtDate.getDate() - 1);
        return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
    }
    setCurrentDefaultDate() {
        let newtDate = new Date();
        newtDate.setDate(newtDate.getDate());
        return newtDate.getMonth() + 1 + '/' + newtDate.getDate() + '/' + newtDate.getFullYear();
    }
    getPreviouesMonthFirstDate() {
        const now = new Date();
        let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return  firstDayPrevMonth.getMonth() + 1 + '/' + firstDayPrevMonth.getDate() + '/' + firstDayPrevMonth.getFullYear();;
    }
    getPreviouesMonthLastDate() {
        let now = new Date();
        now.setDate(1);
        now.setHours(-1);
        return  now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();;
    }
    public getCurrentData() {
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
        return today;
    }
    validateFeatureDate(dateKey) {
        const currnetDate = this.getCurrentData();
        if (new Date(currnetDate) >= new Date(dateKey)) {
            return false;
        } else {
            return true;
        }
    }
}