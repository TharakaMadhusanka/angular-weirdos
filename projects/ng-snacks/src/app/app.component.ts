import {
  AfterViewInit,
  Component,
  effect,
  Host,
  inject,
  OnInit,
  Optional,
  Self,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TypedFormComponent } from './typed-form/typed-form.component';
import {
  Form,
  FormArray,
  FormGroup,
  FormRecord,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserBankFormModel } from '../models/user-bank-form.model';
import { BankAccountModel } from '../models/bank-account.model';
import { CommonModule } from '@angular/common';
import { TypeFormArrayComponent } from './type-form-array/type-form-array.component';
import { DummyService } from '../../dummy.service';
import { HighlighterDirective } from '../../highlighter.directive';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    TypedFormComponent,
    TypeFormArrayComponent,
    ReactiveFormsModule,
    FormsModule,
    HighlighterDirective,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'ng-snacks';

  userBankDetailsFormGroup!: FormGroup<UserBankFormModel>;
  fb!: NonNullableFormBuilder;

  pData = signal('Hello World');

  get bankAccounts(): FormArray<FormGroup<BankAccountModel>> {
    return this.userBankDetailsFormGroup.controls.bankAccounts as FormArray;
  }

  get bankAccountsFr(): FormRecord<FormGroup<BankAccountModel>> {
    return this.userBankDetailsFormGroup.controls.bankAccountsFr;
  }

  constructor(f: NonNullableFormBuilder) {
    this.fb = f;
    effect(() => {
      console.log(this.pData());
    });
  }

  ngOnInit(): void {
    this.userBankDetailsFormGroup = this.fb.group<UserBankFormModel>(
      {
        userName: this.fb.control(''),
        bankAccounts: this.fb.array([]),
        bankAccountsFr: this.fb.record<FormGroup<BankAccountModel>>({}),
      },
      { updateOn: 'change' }
    );
  }

  sum(accumulator: number, currentValue: number): number {
    return accumulator + currentValue;
  }
  onAddBankAccount(): void {
    // Initial Code | Why didn't work
    // I added new control, to the Array Controls, which I updated the value directly itself
    // which didn't trigger ng default CD to notify that form group/ form array is updated
    // Thus change detection won't be triggered and updated the references
    // That only updates the internal array, but doesn’t trigger Angular’s
    // internal bookkeeping that links the new control to the parent FormArray.
    // this.bankAccounts.controls.push(
    //   this.fb.group<BankAccountModel>({
    //     accountName: this.fb.control(''),
    //     accountNumber: this.fb.control(''),
    //   })
    // );

    // Correct Way
    // Instead directly mutating the controls to the values array
    // use angular form array push method
    this.bankAccounts.push(
      this.fb.group<BankAccountModel>({
        accountName: this.fb.control(''),
        accountNumber: this.fb.control(''),
      })
    );
  }

  onAddBankAccountRecord(): void {
    this.bankAccountsFr.addControl(
      (Object.keys(this.bankAccountsFr.controls).length + 1).toString(),
      this.fb.group<BankAccountModel>({
        accountName: this.fb.control(''),
        accountNumber: this.fb.control(''),
      })
    );
  }

  onDelete(key: string): void {
    this.bankAccountsFr.removeControl(key);
    this.bankAccountsFr.updateValueAndValidity();
  }

  onDeleteArrElem(key: number): void {
    this.bankAccounts.removeAt(key);
    this.bankAccountsFr.updateValueAndValidity();
  }

  onSubmit(): void {
    console.log(this.userBankDetailsFormGroup.value);
  }
}
