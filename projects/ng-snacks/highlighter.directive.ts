import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appHighlighter]',
})
export class HighlighterDirective {
  constructor() {}

  private el = inject(ElementRef);

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
