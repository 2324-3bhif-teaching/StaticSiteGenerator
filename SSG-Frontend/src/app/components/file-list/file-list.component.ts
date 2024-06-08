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
}
