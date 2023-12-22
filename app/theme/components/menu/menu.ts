import { Menu } from './menu.model';


/*******************************************
   Menu id are assigned as following:
  -----------
  10 - Home 
  -----------
  20 - Payments
  -----------
  
  ----------
  30-Reports
  ----------
  
  --------
  40-Help
  -----------
  41 - User Manual
  42 - FAQ
  43 - About
  ************************************************/
export const verticalMenuItems = [
    new Menu(10, 'Home', '/home', null, 'home', null, false, 0),
    new Menu(20, 'Payments', null, null, 'money', null, true, 0),
    new Menu(21, 'Payment Lookup', '/paymentlookup', null, null, null, null, 20),
    new Menu(22, 'Payment Correction', '/paymentcorrection', null, null, null, null, 20),
    new Menu(23, 'Reapply Payment', '/reapplypayment', null, null, null, null, 20),
    new Menu(24, 'Return/Reversal Exception List', '/paymentstatus', null, null, null, null, 20),
    new Menu(30, 'Reports', null, null, 'book', null, true, 0),
    new Menu(3016, 'Daily Payment Report', '/paymentlookup', null, null, null, null, 301),
    new Menu(3013, ' Tax Collections as Payments', '/paymentlookup', null, null, null, null, 301),
    new Menu(33, 'Tax Collections as Deposits', '/paymentlookup', null, null, null, null, 30),
    new Menu(34, 'Daily', '/paymentlookup', null, null, null, null, 30),
    new Menu(40, 'Help', null, null, 'info-circle', null, true, 0),
    new Menu(41, 'User Manual', '/paymentlookup', null, null, null, null, 40),
    new Menu(42, 'FAQ', '/paymentlookup', null, null, null, null, 40),
    new Menu(43, 'About', '/about', null, null, null, null, 40),
]

export const horizontalMenuItems = [
    new Menu(10, 'Home', '/home', null, 'home', null, false, 0),
    new Menu(20, 'Payments', null, null, 'money', null, true, 0),
    new Menu(21, 'Payment Lookup', '/paymentlookup', null, null, null, null, 20),
    new Menu(22, 'Payment Correction', '/paymentcorrection', null, null, null, null, 20),
   // new Menu(22, 'Payment Correction', null, null, null, null, null, 20),
    new Menu(23, 'Reapply Payment', '/reapplypayment', null, null, null, null, 20),
     new Menu(24, 'Return/Reversal Exception List', '/reversalException', null, null, null, null, 20),
   new Menu(26, 'eLockbox Exception List', '/elockboxExceptionList', null, null, null, null, 20),
   
   // new Menu(23, 'Reapply Payment', null, null, null, null, null, 20),
    //new Menu(24, 'Double Payments', null, null, null, null, null, 20),
    new Menu(30, 'Reports', null, null, 'book', null, true, 0), 
   
    new Menu(301, 'Accounting',null, null, null, null, true, 30),
    new Menu(3010,  'Daily Balancing Report', 'report/dailybalancingreport', null, null, null, null, 301),
    new Menu(3011, 'Transaction Register', 'report/transactionreport', null, null, null, null, 301),
    new Menu(3012, 'Daily Batch Report', 'report/dailybatchreport', null, null, null, null, 301),
    new Menu(3013, 'Tax Collections as Payments', 'report/paymentTaxCollection', null, null, null, null, 301),
    new Menu(3014, 'Batch Type -Self Service Report', 'report/selfservicereport', null, null, null, null, 301),
    new Menu(3015,  'Pending Payments Report', 'report/dailypendingpaymentreport', null, null, null, null, 301),
    new Menu(3016, 'Daily Payment Report', 'report/dailypaymentreport', null, null, null, null, 301),
    
    //new Menu(32, 'Legacy Daily Payments Report',null, null, null, null, null, 30),
    new Menu(3017, 'Legacy Daily Payments Report', 'report/legacyDailyPaymentReport', null, null, null, null, 301),
    new Menu(311, 'eLockbox',null, null, null, null, true, 30),    
    new Menu(3110, 'Exception Report','report/elockbox/exceptionreport', null, null, null, null, 311),    
    new Menu(3111, 'Union Bank Detail Report','report/elockbox/unionbankreport', null, null, null, null, 311),    
    new Menu(3112, 'Collection Summary Report','report/elockbox/collectionsummary', null, null, null, null, 311),    
   // new Menu(316, 'Batch Summary Report','report/elockbox/batchsummary', null, null, null, null, 312),    
    new Menu(3113, 'Collection Detail Report','report/elockbox/collectiondetail', null, null, null, null, 311),  
    //new Menu(33, 'Tax Collections as Payments', null, null, null, null, null, 30),
    
   //new Menu(34, 'Tax Collections as Deposits', null, null, null, null, null, 30),
    
   
    //new Menu(35, 'Transaction Register',null, null, null, null, null, 30),
    //new Menu(36, 'Daily Batch Report', null, null, null, null, null, 30),
    
    
   
    //new Menu(37, 'Batch Type -Self Service Report', null, null, null, null, null, 30),
  
   
     //new Menu(39, 'Daily Exception Report', null, null, null, null, null, 30),
     new Menu(321, 'Year End Reports',null, null, null, null, true, 30),
     new Menu(3210,  'Supplemental Pending Paid Report', 'report/supplementalreport', null, null, null, null, 321),

 new Menu(3211, 'Current Secured Unpaid Tax Charges', 'report/currentsecuredunpaidcharge', null, null, null, null, 321),
    
     
    
   
    new Menu(331, 'Apportionment',null, null, null, null, true, 30),
    new Menu(3310, 'Current Secured Collections','report/Apportionment/currentsecuredcollections', null, null, null, null, 331), 
    new Menu(341, 'Tax Collections as Deposits', 'report/depositsTaxCollection', null, null, null, null, 30),
    new Menu(351,  'Daily Exception Report', 'report/dailyexceptionreport', null, null, null, null, 30),
    new Menu(361,  'Jeopardy Letters', 'report/jeopardyletterslist', null, null, null, null, 30),
    
    

    //, 'Pending Payments Report', null, null, null, null, null, 30),
    new Menu(40, 'Help', null, null, 'info-circle', null, true, 0),
    new Menu(41, 'User Guide', 'help/userGuide', null, null, null, null, 40),
    new Menu(42, 'Batch No Assignments', 'help/batchNoAssignments', null, null, null, null, 40),
    new Menu(43, 'about', '/about', null, null, null, null, 40),

]