import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface WeirdozFormGroupModel {
  fieldsArray: FormArray<FormGroup<{ name: FormControl<string> }>>;
}
@Component({
  selector: 'app-control-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './control-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlListComponent implements OnInit {
  weirdozFg!: FormGroup<WeirdozFormGroupModel>;
  runcount = 0;

  get fieldsArray() {
    return this.weirdozFg.controls.fieldsArray as FormArray<
      FormGroup<{ name: FormControl<string> }>
    >;
  }

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit() {
    this.weirdozFg = this.fb.group<WeirdozFormGroupModel>(
      {
        fieldsArray: this.fb.array<FormGroup<{ name: FormControl<string> }>>(
          []
        ),
      },
      { updateOn: 'submit' }
    );
  }

  // Function which adds form control
  addControl() {
    const group = this.fb.group<{ name: FormControl<string> }>({
      name: this.fb.control<string>('', {
        validators: [this.duplicateNameValidator()],
        // When to run the validation
        // 'change' - on every change
        // 'blur' - when the control loses focus
        // 'submit' - when the form is submitted
        updateOn: 'blur',
      }),
    });
    this.weirdozFg.controls.fieldsArray.push(group, { emitEvent: false });
  }

  duplicateNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log(`Run count ${++this.runcount}`);
      // isDirty
      console.log(`isControlDirty ${control.dirty}`);
      // isTouched
      console.log(`isControlTouched ${control.touched}`);

      if (!control.value) {
        // If the control is not touched or has no value, skip validation
        return null;
      }

      console.log('Validator reached to functional area');

      // Check if the control has a value
      const name = control.value;
      const isDuplicate = this.fieldsArray.controls.filter((group) => {
        return group.get('name')?.value === name;
      });
      return isDuplicate.length > 1 ? { duplicateName: true } : null;
    };
  }
}
