import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  FormRecord,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BankAccountModel } from '../../models/bank-account.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-form-array',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './type-form-array.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TypeFormArrayComponent {
  formArray = input.required<FormArray<FormGroup<BankAccountModel>>>();
  delete = output<number>();
}
