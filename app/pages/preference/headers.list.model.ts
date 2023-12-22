export class LookupTableHeaderStatus {
    item_id: string;
    item_text: string;
    isSelected:boolean;
  }
  
export const lookupTableHeaderData:LookupTableHeaderStatus[]=[
 
{ item_id: 'transactionDate', item_text: 'Transaction Date', isSelected : false},
{ item_id: 'creditDate', item_text: 'Credit Date', isSelected : false },
{ item_id: 'apn', item_text: 'APN', isSelected : false},
{ item_id: 'tracerNo', item_text: 'Tracer No.', isSelected : false },
{ item_id: 'installNo', item_text: 'Install No.', isSelected : false },
{ item_id: 'paymentStatus', item_text: 'Payment Status', isSelected : false },
{ item_id: 'reason', item_text: 'Reason', isSelected : false},
{ item_id: 'taxAmountPaid', item_text: 'Tax Amount', isSelected : false },
{ item_id: 'penaltyAmount', item_text:'Penalty Amount', isSelected : false},
{ item_id: 'interestAmount', item_text: 'Interest Amount', isSelected : false },
{ item_id: 'costAmount', item_text: 'Cost Amount', isSelected : false },
{ item_id: 'totalAmount', item_text: 'Total Amount', isSelected : false},
{ item_id: 'depositDate', item_text: 'Deposit Date', isSelected : false },
// { item_id: 'returnCheckFee', item_text:'Returned Check Fee', isSelected : false},
{ item_id: 'paymentFiscalYear', item_text: 'Payment Fiscal Year', isSelected : false},
{ item_id: 'taxBillFiscalYear', item_text:'Tax Bill Fiscal Year', isSelected : false},
{ item_id: 'taxType', item_text: 'Tax Type', isSelected : false },
{ item_id: 'supplementalType', item_text: 'Supplemental Type', isSelected : false },
{ item_id: 'batchAgencyName', item_text: 'Batch Agency Name', isSelected : false},
{ item_id: 'batchNo', item_text: 'Batch No.', isSelected : false },
{ item_id: 'tellerNo', item_text: 'Teller No.', isSelected : false},
{ item_id: 'ncrSequenceNo',item_text:'Batch Sequence No.', isSelected : false},
{ item_id: 'checkNo', item_text: 'Check No.', isSelected : false },
{ item_id: 'paymentSource', item_text: 'Payment Source', isSelected : false },
{ item_id: 'paymentMethod', item_text: 'Payment Method', isSelected : false},
{ item_id: 'methodType', item_text: 'Method Type', isSelected : false},
{ item_id: 'createdBy', item_text: 'Created By', isSelected : false },
{ item_id: 'createdDate', item_text: 'Created Date', isSelected : false },

]
