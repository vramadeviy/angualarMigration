import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApnSearchPipe } from './apn-filter';
import { TracerNumberSearchPipe } from './tracer-number-filter';
import { UpdatedBySearchPipe } from './updated-by-filter';
import { PaymentFiscalYearrSearchPipe } from './payment-fiscal-year-filter';
import {BatchNoSearchPipe} from './batch-no-filter';
import {CheckNumberSearchPipe} from './check-no-filter';
import {TellerNumberSearchPipe} from './teller-no-filter';
import {InstallmentSearchSearchPipe} from './installment-search-filter';
import {PaymentStatusSearchPipe} from './payment-status-filter';
import {PaymentReasonSearchPipe} from './payment-reason-filter';
import {PaymentSourceSearchPipe} from './payment-source-filter';
import {PaymentTaxTypeSearchPipe} from './payment-tax-type-filter';
import {NCRNumberSearchPipe} from './payment-ncr-filter';
import {TaxBillYearSearchPipe} from './tax-bill-year-filter';
import {PaymentMethodSearchPipe} from './payment-method-filter';
import { PaymentTotalsPipe } from './payment-totals-filter';
import { BatchAgencySearchPipe } from './batchagency-filter';
import { SupplementalTypeSearchPipe } from './supplemental-Type.filter';
import { MethodTypeSearchPipe } from './method-Type.filter';
import { DateValidator } from '../../report/Tax-Collections-As-Payments/date-validator';
@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        ApnSearchPipe,
        TracerNumberSearchPipe,
        UpdatedBySearchPipe,
        PaymentFiscalYearrSearchPipe,
        BatchNoSearchPipe,
        CheckNumberSearchPipe,
        TellerNumberSearchPipe,
        InstallmentSearchSearchPipe,
        PaymentStatusSearchPipe,
        PaymentReasonSearchPipe,
        PaymentSourceSearchPipe,
        PaymentTaxTypeSearchPipe,
        NCRNumberSearchPipe,
        TaxBillYearSearchPipe,
        PaymentMethodSearchPipe,
        PaymentTotalsPipe,
        BatchAgencySearchPipe,
        SupplementalTypeSearchPipe,
        MethodTypeSearchPipe,
        DateValidator
    ],
    exports: [
        ApnSearchPipe,
        TracerNumberSearchPipe,
        UpdatedBySearchPipe,
        PaymentFiscalYearrSearchPipe,
        BatchNoSearchPipe,
        CheckNumberSearchPipe,
        TellerNumberSearchPipe,
        InstallmentSearchSearchPipe,
        PaymentStatusSearchPipe,
        PaymentReasonSearchPipe,
        PaymentSourceSearchPipe,
        PaymentTaxTypeSearchPipe,
        NCRNumberSearchPipe,
        TaxBillYearSearchPipe,
        PaymentMethodSearchPipe,
        PaymentTotalsPipe,
        BatchAgencySearchPipe,
        SupplementalTypeSearchPipe,
        MethodTypeSearchPipe,
        DateValidator
    ]
})
export class PipesModule { }
