import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
} from '@angular/forms';
import { BankAccountModel } from './bank-account.model';

export interface UserBankFormModel {
  userName: FormControl<string>;
  bankAccounts: FormArray;
  bankAccountsFr: FormRecord<FormGroup<BankAccountModel>>;
}
