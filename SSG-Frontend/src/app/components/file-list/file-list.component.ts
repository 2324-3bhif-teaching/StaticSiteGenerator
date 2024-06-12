import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FileService, SSGFile } from "../../services/file.service";
import { CommonModule } from "@angular/common";
import { faArrowDown, faArrowUp, faDeleteLeft, faFile, faFileArchive, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { Project } from '../../services/project.service';


@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, FaIconComponent, FormsModule, FaIconComponent],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent {
  @Input() project: Project = { id: -1, name: "Default", theme: { id: -1, name: "Def", userName: "Usr", isPublic: false } };
  @Output() changeActiveFile = new EventEmitter<number>();
  private DefaultFile: SSGFile = { id: -1, index: -1, name: "" };
  protected files: SSGFile[] = [];
  protected activeFile: SSGFile = this.DefaultFile;
  faDelete = faTrash;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faFile = faFile;
  faUpload = faUpload;

  fileToUpload: File | null = null;
  validFile: boolean = true;

  constructor(private fileService: FileService) {

  }

  ngOnInit(): void {
    this.fileService.getAllFilesOfProject(this.project.id).subscribe(files => {
      this.files = files;
    });
  }

  handleActiveFile(file: SSGFile) {
    if (this.activeFile.id === -1 || file.id !== this.activeFile.id) {
      this.activeFile = file;
    } else {
      this.activeFile = this.DefaultFile;
    }
    this.changeActiveFile.emit(this.activeFile.id);
  }

  onFileDelete(): void {
    if (this.activeFile.id !== -1) {
      this.files = this.files.filter(file => file.id !== this.activeFile.id);
      this.fileService.deleteFile(this.activeFile.id).subscribe();
      this.activeFile = this.DefaultFile;
      this.changeActiveFile.emit(this.activeFile.id);
    }
  }

  onFileUpdate(deltaIndex: number) {
    if (this.activeFile.id !== -1) {
      const newIndex: number = this.activeFile.index + deltaIndex;
      if (newIndex >= 0 && newIndex < this.files.length) {
        // Temporarily store the file that will be swapped
        const fileToSwap = this.files[newIndex];

        // Swap the files in the array
        this.files[newIndex] = this.activeFile;
        this.files[this.activeFile.index] = fileToSwap;

        // Update the index of the active file
        this.activeFile.index = newIndex;

        // Also update the index of the swapped file
        fileToSwap.index = this.activeFile.index - deltaIndex;

        // Update the indices in the backend or service as needed
        this.fileService.updateFileIndex(this.activeFile.id, newIndex).subscribe();
      }
    }
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

  uploadFile(): void {
    if (this.fileToUpload === null) {
      return;
    }

    this.fileService.postFile(this.fileToUpload, this.project.id).subscribe(data => {
      console.log(data);
    });

    document.location.reload();
  }
}
