import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';

/**
 * An extended version of Angular's `FormControl` that adds support for warning messages.
 *
 * @template T - The type of value held by the form control.
 *
 * This interface extends the standard `FormControl<T>` by introducing an optional `warnings` property.
 * The `warnings` property is a dictionary where each key represents a warning identifier (such as a validation warning name),
 * and the value is a string describing the warning message. This allows you to associate non-blocking warnings
 * (as opposed to errors) with a form control, which can be useful for providing user feedback without preventing form submission.
 *
 * @property { { [key: string]: string } | null } [warnings] - An optional object mapping warning keys to their corresponding messages.
 * If no warnings are present, this property can be `null` or omitted.
 */
export interface ExtendedFormControl<T> extends FormControl<T> {
  warnings?: { [key: string]: string } | null;
}

export type WarningsPropertyName = keyof ExtendedFormControl<any>;

export const getWarningsPropertyName = (): WarningsPropertyName => {
  return 'warnings';
};

/**
 * Represents the structure of the user registration form group model.
 *
 * This interface defines the expected controls for the user registration form.
 * Each property corresponds to a form control used to capture user input.
 *
 * @property fullName - An `ExtendedFormControl` instance for capturing the user's full name.
 *   This control is expected to handle string values and may include additional
 *   validation or metadata as defined by the `ExtendedFormControl` type.
 *
 * @remarks
 * Extend this interface to include additional fields as required for the registration process.
 */
export interface UserRegisterFormGroupModel {
  fullName: ExtendedFormControl<string>;
}

/**
 * Registers a custom warnings property on the provided form control.
 *
 * This function uses `Object.defineProperty` to attach a computed property (whose name is determined by `getWarningsPropertyName()`)
 * to the given `control` object. The property's getter invokes the supplied `warningFunc`, which should return an object mapping
 * warning keys to warning messages, or `null` if there are no warnings.
 *
 * @template T - The type of the form control's value.
 * @param control - The form control to which the warnings property will be attached. Must extend `ExtendedFormControl<T>`.
 * @param warningFunc - A function that returns an object containing warning messages, keyed by string, or `null` if no warnings exist.
 *
 * @remarks
 * This is useful for dynamically providing warning messages (distinct from validation errors) for form controls in Angular forms.
 * The warnings property is not enumerable and is accessed via the computed property name.
 *
 * @example
 * ```typescript
 * registerWarnings(myControl, () => ({ 'minLength': 'Too short!' }));
 * console.log(myControl[getWarningsPropertyName()]); // { minLength: 'Too short!' }
 * ```
 */
export const registerWarnings = <T>(
  control: ExtendedFormControl<T>,
  warningFunc: () => { [key: string]: string } | null
) => {
  Object.defineProperty(control, getWarningsPropertyName(), {
    get: () => warningFunc(),
  });

  control.valueChanges.subscribe(() => {
    control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  });
};

@Component({
  selector: 'app-form-field-warning',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    PanelModule,
    MessageModule,
    ButtonModule,
    DividerModule,
    FieldsetModule,
  ],
  templateUrl: './form-field-warning.component.html',
})
export class FormFieldWarningComponent implements OnInit {
  userRegisterFg!: FormGroup<UserRegisterFormGroupModel>;

  constructor(private fb: NonNullableFormBuilder) {}

  get fullName() {
    return this.userRegisterFg.controls.fullName;
  }

  get errors() {
    let list: string = '';
    if (this.userRegisterFg.errors) {
      for (let key in this.userRegisterFg.errors) {
        list += this.userRegisterFg.errors[key] + ',';
      }
    }
    return list.trim();
  }

  get warnings() {
    let list: string = '';
    for (let key in this.fullName.warnings) {
      list += this.fullName.warnings[key] + ',';
    }
    return list;
  }

  ngOnInit(): void {
    this.userRegisterFg = this.fb.group<UserRegisterFormGroupModel>({
      fullName: this.fb.control<string>('', {
        validators: [Validators.required],
      }),
    });

    registerWarnings<string>(this.fullName, () => {
      return this.fullName.value.length > 10
        ? { maxLengthExceeded: 'No of maximum characters is 10.' }
        : null;
    });
  }
}
