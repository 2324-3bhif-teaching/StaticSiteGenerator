import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import { GlobalErrorHandlerService } from '../../services/global-error-handler.service';

@Component({
  selector: 'app-theme-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './theme-modal.component.html',
  styleUrl: './theme-modal.component.css'
})
export class ThemeModalComponent {
  protected themeName: string = "";
  protected isPublic: boolean = false;

  constructor(public dialogRef: MatDialogRef<ThemeModalComponent>,private globEHandler:GlobalErrorHandlerService) {

  }

  confirm() {
    if (this.themeName === "") {
      this.globEHandler.handleError(new Error("Theme Name cannot be empty"));
      return;
    }
    if(this.themeName.length > 255){
      this.globEHandler.handleError(new Error("Theme Name cannot be longer than 255 Characters"));
      return;
    }
    this.dialogRef.close({ name: this.themeName, isPublic: this.isPublic });
  }

  close() {
    this.dialogRef.close();
  }
}
