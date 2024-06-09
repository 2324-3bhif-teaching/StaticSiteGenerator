import {Component, Input} from '@angular/core';
import {FileService} from "../../services/file.service";
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent {
  @Input() fileId: number = 1;
  @Input() themeId: number = 1;
  public fileHtml: string = "";

  constructor(private fileService: FileService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.fileService.convertFile(this.fileId).subscribe(html => {
       this.fileHtml = html.html;
    });
    this.themeService.convertTheme(this.themeId).subscribe(css => {
      this.fileHtml += `<style>${css.css}</style>`;
      console.log(this.fileHtml);
    });
  }
}
