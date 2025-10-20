import { AbstractControl, FormControl } from '@angular/forms';

export interface BankAccountModel {
  accountName: AbstractControl<string>;
  accountNumber: AbstractControl<string>;
}
