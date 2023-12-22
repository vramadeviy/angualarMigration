export interface DropDownInterface{
    item_id:string;
    item_text:string
}
export const TaxTypeList: DropDownInterface[] = [
    { item_id: 'All' , item_text:'Select All'},
    { item_id: 'Sec' , item_text:'Secured'},
    { item_id: 'Sup' , item_text:'Supplemental' },    
    { item_id: 'SDS' , item_text:'Secured Delinquent' },
    { item_id: 'UnSec' , item_text:'Unsecured' }
];


export const PaymentSourceList: DropDownInterface[] = [
   
    { item_id: 'OTC_Cashiering' , item_text:'Cashiering'},
    { item_id: 'CORTAC' , item_text:'CORTAC ' },    
    { item_id: 'Non_Cortac_EFT' , item_text:'Non-CORTAC EFT' },
    { item_id: 'SelfService_IVR' , item_text:'IVR(Phone)' },
    { item_id: 'SelfService_KSK' , item_text:'Kiosk'},
    { item_id: 'LockBox' , item_text:'Lock-Box' },  
    { item_id: 'eLockbox', item_text: 'eLockbox' },            
    { item_id: 'SelfService_MOB' , item_text:'Mobile' },
    { item_id: 'OTC_Remittance' , item_text:'Remittance' },
    { item_id: 'SelfService_WEB' , item_text:'Web'},
    { item_id: 'OTC_Other' , item_text:'Over the Counter - Other' },    
    { item_id: 'SelfService_UNK' , item_text:'Self Service - Other' },
    { item_id: 'Other' , item_text:'other ' },
    { item_id: 'All' , item_text:'Select Payment Source' }  
];

export const PaymentMethodList: DropDownInterface[] = [
    { item_id: 'ACH_Advance' , item_text:'ACH-Advance' },
    { item_id: 'ACH_Return' , item_text:'ACH-Return' },
    { item_id: 'ACH_Other' , item_text:'ACH-Other' },
    { item_id: 'Cash' , item_text:'Cash ' },
    { item_id: 'Check' , item_text:'Check '},
    { item_id: 'CreditCard' , item_text:'Credit Cards' },    
    { item_id: 'EFT' , item_text:'EFT ' },
    { item_id: 'Other' , item_text:'Other ' },
    { item_id: 'All' , item_text:'Select All' }  
]
export const MethodType: DropDownInterface[]=[
    { item_id: 'American Express' , item_text:'Amex' },    
    { item_id: 'Discover' , item_text:'Discover ' },
    { item_id: 'MasterCard' , item_text:'MasterCard ' },
    { item_id: 'Visa' , item_text:'Visa ' },
    { item_id: 'Unknown' , item_text:'Unknown ' },   
    { item_id: 'All' , item_text:'Select All' } 
]



