import {Component, Input} from '@angular/core';
import {FileService} from "../../services/file.service";

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent {
  @Input() fileId: number = 1;
  public fileHtml: string = "";

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.fileService.convertFile(this.fileId).subscribe(html => {
       this.fileHtml = html.html;
    });
  }
}
