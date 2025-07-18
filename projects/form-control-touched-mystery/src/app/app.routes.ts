import { Routes } from '@angular/router';
import { FormFieldWarningComponent } from './form-field-warning/form-field-warning.component';
import { ControlListComponent } from './control-list/control-list.component';

export const routes: Routes = [
  {
    path: 'warning-message',
    component: FormFieldWarningComponent,
  },
  {
    path: 'control-list',
    component: ControlListComponent,
  },
];
