import {
  Component,
  computed,
  effect,
  OnInit,
  signal,
  untracked,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ng-signals';

  constructor() {
    effect(() => {
      console.log(`${this.dependantSignalWithTrack()}-Effect`);
    });
  }

  ngOnInit() {}

  // Signal
  signalOne: WritableSignal<string> = signal('Hello');

  // Compute Function maintaining the dependancy
  // When a signal updates, all its dependent signals will then get updated automatically.
  // If a derived signal depends on a source signal, we need to make
  // sure we call the source signal every time that the compute function gets called. [source signal should be invoked, at the intialization]
  dependantSignalWithTrack = computed(() => {
    return `${this.signalOne()}-World`;
  });

  // Compute function without maintaining the dependency
  // It will store only the first value, and it wont be updated when the source signal is updated
  dependantSignalWithUnTrack = computed(() => {
    return untracked(() => `${this.signalOne()}-World`);
  });

  // Set vs Update
  // update --> take a function as a parameter and it returns the current signal value as the func input
  updateSignal(): void {
    this.signalOne.update(() => 'olleH');
  }

  // set --> will add value, and it is input is the current value
  setSignal(): void {
    this.signalOne.set('New Hello');
  }
}
