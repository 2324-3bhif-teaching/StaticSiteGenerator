import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { GlobalErrorHandlerService } from '../../services/global-error-handler.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css'
})
export class ProjectModalComponent {

  public pjName: string = "";

  constructor(public dialogRef: MatDialogRef<ProjectModalComponent>,private globEHandler:GlobalErrorHandlerService) {

  }

  confirm() {
    if(this.pjName.length >255 ){
      this.globEHandler.handleError(new Error("Project Name cannot be longer than 255 Characters"));
      return;
    }
    if(this.pjName.trim().length === 0){
      this.globEHandler.handleError(new Error("Project Name cannot be empty"));
      return;
    }

    this.dialogRef.close({ name: this.pjName, theme: "Default" });
  }

  close() {
    this.dialogRef.close();
  }
}
