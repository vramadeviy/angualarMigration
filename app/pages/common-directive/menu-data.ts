
export class menuDataFormat {
    item_id: string;
    item_text: string;  
    
  }
  
  export const menuData:menuDataFormat[]=[
    { item_id:'10', item_text : 'Home'},
    { item_id:'21', item_text : 'Payment Lookup'},
    { item_id:'22', item_text : 'Payment Correction'},
    { item_id:'23', item_text : 'Reapply Payment'},
   // { item_id:'24', item_text : 'Double Payments'},
    { item_id:'31', item_text : 'Daily Payment Report'},
    { item_id:'32', item_text : 'Legacy Daily Payments Report'},
    { item_id:'33', item_text : 'Tax Collections as Payments' },
    { item_id:'34', item_text : 'Tax Collections as Deposits'},
     { item_id:'35', item_text : 'Transaction Register'},
    { item_id:'36', item_text : 'Daily Batch Report'},
      { item_id:'37', item_text : 'Batch Type-Self Service Report'},
       { item_id:'38', item_text : 'Pending Payments Report'},
    // { item_id:'41', item_text : 'User Manual', isSelected: false},
    // { item_id:'42', item_text : 'FAQ', isSelected: false}, 
    // { item_id:'43', item_text : 'About', isSelected: false},   
    
  ];

