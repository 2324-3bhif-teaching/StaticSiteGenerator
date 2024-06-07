import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInfo, faUpload, faFileArchive } from '@fortawesome/free-solid-svg-icons';
import { FileService } from '../../services/file.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FaIconComponent, FormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  fileToUpload: File | null = null;
  faUpload = faUpload;
  faInfo = faInfo;
  faFileArchive = faFileArchive;
  validFile = true;


  constructor(private fileService: FileService) {

  }

  handleFileInput(event: any): void {
    const file: File = event.target.files.item(0);
    console.log(file);
    if (!file.name.endsWith(".adoc")) {
      this.validFile = false;
      return;
    }
    this.validFile = true;


    this.fileToUpload = file;
  }

  uploadFile() {
    if (this.fileToUpload === null) {
      return;
    }

    this.fileService.postFile(this.fileToUpload).subscribe(data => {
      console.log(data);
    });
  }
}
