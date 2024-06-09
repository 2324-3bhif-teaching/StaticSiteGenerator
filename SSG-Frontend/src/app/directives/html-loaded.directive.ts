import { Directive, ElementRef, Output, EventEmitter, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appHtmlLoaded]',
  standalone: true
})
export class HtmlLoadedDirective implements AfterViewChecked {
  @Output() htmlLoaded = new EventEmitter<void>();

  constructor(private el: ElementRef) { }

  ngAfterViewChecked() {
    const contentLoaded = this.el.nativeElement.innerHTML.trim().length > 0;
    if (contentLoaded) {
      this.htmlLoaded.emit();
    }
  }
}
