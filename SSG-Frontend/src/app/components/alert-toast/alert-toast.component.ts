import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ErrorHandler, Input, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-alert-toast',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './alert-toast.component.html',
  styleUrl: './alert-toast.component.css',animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AlertToastComponent  {

  @Input() public errorMsg : string = "";

  faError = faXmarkCircle;
  

}

