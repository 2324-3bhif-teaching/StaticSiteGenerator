import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FileService} from "../../services/file.service";
import {ThemeService} from "../../services/theme.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import hljs from 'highlight.js';
import {CommonModule} from "@angular/common";
import {HtmlLoadedDirective} from "../../directives/html-loaded.directive";

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [CommonModule, HtmlLoadedDirective],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnChanges {
  @Input() fileId: number = -1;
  @Input() themeId: number = -1;
  protected fileHtml: SafeHtml = "";
  private isLoaded = false;

  constructor(
    private fileService: FileService,
    private themeService: ThemeService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileId'] || changes['themeId']) {
      this.reloadFilePreview();
    }
  }

  protected reloadFilePreview() {
    if (this.fileId === -1 || this.themeId === -1) {
      this.fileHtml = "";
      return;
    }
    let fileHtml: string = "";
    this.fileService.convertFile(this.fileId).subscribe(html => {
      fileHtml = html.html;
      this.themeService.convertTheme(this.themeId).subscribe(css => {
        fileHtml += `<style>${css.css}</style>`;
        this.fileHtml = this.sanitizer.bypassSecurityTrustHtml(fileHtml);
        this.isLoaded = false;
      });
    });
  }

  onHtmlLoaded() {
    if (!this.isLoaded) {
      hljs.highlightAll();
      this.isLoaded = true;
    }
  }
}
