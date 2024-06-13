import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";

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

  constructor(public dialogRef: MatDialogRef<ThemeModalComponent>) {

  }

  confirm() {
    if (this.themeName === "") {
      return;
    }
    this.dialogRef.close({ name: this.themeName, isPublic: this.isPublic });
  }

  close() {
    this.dialogRef.close();
  }
}
