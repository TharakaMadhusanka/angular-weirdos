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
import { first } from 'rxjs';

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
        validators: [this.duplicateNameValidatorAntiPatternApproachOne()],
        // When to run the validation
        // 'change' - on every change
        // 'blur' - when the control loses focus
        // 'submit' - when the form is submitted
        updateOn: 'blur',
      }),
    });
    this.weirdozFg.controls.fieldsArray.push(group, { emitEvent: false });

    // Approach 1 - Mark as touched explicitly
    group.controls.name.valueChanges.subscribe((_) => {
      group.controls.name.markAsTouched();
      group.controls.name.updateValueAndValidity();
    });
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

  // By following the Anti Pattern to check Form Control Touched state before
  // executes the validation
  // by following the anti pattern, we can expect the validator is not working as expected
  // This issue, we can fix using following approaches, which makes the code to handle unnecessary operations
  // 1. Using Value Changes and mark the field touched on first change
  // 2. Using Async Validator and NgOnStable

  // Approach 1 - Use Value Changes, update the touched state explicitly
  duplicateNameValidatorAntiPatternApproachOne(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log(`Run count ${++this.runcount}`);
      // isDirty
      console.log(`isControlDirty ${control.dirty}`);
      // isTouched
      console.log(`isControlTouched ${control.touched}`);

      // Anti-pattern, to check Touched State inside the validator Func
      if (!control.touched || !control.value) {
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
