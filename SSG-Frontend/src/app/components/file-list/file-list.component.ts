import { Component } from '@angular/core';
import {FileService, SSGFile} from "../../services/file.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent {
  public files: SSGFile[] = [];
  public activeFile: SSGFile = { id: -1, index: -1, name: "" };

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getAllFilesOfProject(1).subscribe(files => {
      this.files = files;
    });
  }

  onFileDelete() {
    if (this.activeFile.id !== -1) {
      this.files = this.files.filter(file => file.id !== this.activeFile.id);
      this.fileService.deleteFile(this.activeFile.id).subscribe();
    }
  }

  onFileUpdate(deltaIndex: number) {
    if (this.activeFile.id !== -1) {
      const newIndex: number = this.activeFile.index + deltaIndex;
      if (newIndex >= 0 && newIndex < this.files.length) {
        this.files[this.activeFile.index] = this.files[newIndex];
        this.files[newIndex] = this.activeFile;
        this.activeFile.index = newIndex;
        this.fileService.updateFileIndex(this.activeFile.id, newIndex).subscribe();
      }
    }
  }
}
