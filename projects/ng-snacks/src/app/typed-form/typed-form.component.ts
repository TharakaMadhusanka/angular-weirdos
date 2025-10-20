import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  FormRecord,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BankAccountModel } from '../../models/bank-account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typed-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './typed-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TypedFormComponent {
  cData = input<string>('');
  // without using separate output event emit listener,
  // can do the same inline
  // But note - required Suffix Change
  cDataChange = output<string>();

  in = model<string>();

  formRecord = input.required<FormRecord<FormGroup<BankAccountModel>>>();
  delete = output<string>();

  onDataChange() {
    this.cDataChange.emit('something');
  }
}
