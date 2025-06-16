import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlListComponent } from './control-list/control-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ControlListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-weirdos';
}
