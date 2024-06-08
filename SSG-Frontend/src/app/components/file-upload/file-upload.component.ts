import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faInfo, faUpload, faFileArchive } from '@fortawesome/free-solid-svg-icons';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FaIconComponent],
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
    const formData: FormData = new FormData();

    if (this.fileToUpload === null) {
      return;
    }

    formData.append('file', this.fileToUpload, this.fileToUpload.name);

    this.fileService.postFile(formData).subscribe(data => {
      console.log(data);
    });
  }
}
