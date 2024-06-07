import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {

  public pjName: string = "";

  constructor(public dialogRef: MatDialogRef<ProjectModalComponent>) {

  }

  confirm() {
    this.dialogRef.close({ name: this.pjName, theme: "Default" });
  }

  close() {
    this.dialogRef.close();
  }
}
