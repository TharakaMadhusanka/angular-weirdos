import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormFieldWarningComponent } from './form-field-warning/form-field-warning.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormFieldWarningComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'formcontrol-inline-warning-message';
}
