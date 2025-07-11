import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  first,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

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

  constructor(private fb: NonNullableFormBuilder, private ngZone: NgZone) {}

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
        asyncValidators: [this.duplicateNameAsyncValidatorOnStable()],
        // When to run the validation
        // 'change' - on every change
        // 'blur' - when the control loses focus
        // 'submit' - when the form is submitted
        updateOn: 'blur',
      }),
    });
    this.weirdozFg.controls.fieldsArray.push(group, { emitEvent: false });

    // Approach 1 - Mark as touched explicitly
    // Commented out to simulate for Approach 2/3
    // group.controls.name.valueChanges.subscribe((_) => {
    //   group.controls.name.markAsTouched();
    //   group.controls.name.updateValueAndValidity({ emitEvent: false });
    // });
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

  // Approach 2 - Async Validator with Delay
  duplicateNameAsyncValidatorWithDelay(): AsyncValidatorFn {
    // We return the AsyncValidatorFn, which takes the control as an argument
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(`Async Validator Triggered. Current value: ${control.value}`);

      return of(control.value).pipe(
        delay(300),
        map((name: string) => {
          console.log(
            '--- Async Validator running validation logic after delay ---'
          );
          console.log(`Run count ${++this.runcount}`);
          // isDirty
          console.log(`isControlDirty ${control.dirty}`);
          // isTouched
          console.log(`isControlTouched ${control.touched}`);

          if (!control.value || !control.touched) {
            console.log('Value is empty or null, returning null (no error)');
            return null;
          }

          const isDuplicate = this.fieldsArray.controls.filter((group: any) => {
            return group.get('name')?.value === name;
          });

          return isDuplicate.length > 1 ? { duplicateName: true } : null;
        })
      );
    };
  }

  // Approach 3 - Using NgZone OnStable with AsyncValdiator
  duplicateNameAsyncValidatorOnStable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(
        `Inside OnStable, Async Validator Triggered. Current value: ${control.value}`
      );
      return new Observable((obs) => {
        this.ngZone.onStable.pipe(first()).subscribe(() => {
          console.log(`Run count: ${++this.runcount}`);
          console.log(`isControlDirty: ${control.dirty}`);
          console.log(`isControlTouched: ${control.touched}`);

          if (!control.value || !control.touched) {
            obs.next(null);
            obs.complete();
            return;
          }
          const name = control.value;
          const isDuplicate = this.fieldsArray.controls.filter((group: any) => {
            return group.get('name')?.value === name;
          });

          console.log(
            'Reached the end of the validator function',
            isDuplicate.length
          );

          let error = isDuplicate.length > 1 ? { duplicateName: true } : null;
          obs.next(error);
          obs.complete();
        });
      });
    };
  }
}
