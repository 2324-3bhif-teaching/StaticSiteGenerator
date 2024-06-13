import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {FileService} from "../../services/file.service";
import {ThemeService} from "../../services/theme.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent implements OnChanges {
  @Input() fileId: number = -1;
  @Input() themeId: number = -1;
  @ViewChild('preview', { static: false }) iframe: ElementRef | null = null;

  constructor(
    private fileService: FileService,
    private themeService: ThemeService) {
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileId'] || changes['themeId']) {
      this.reloadFilePreview();
    }
  }

  protected reloadFilePreview() {
    if (this.fileId === -1 || this.themeId === -1) {
      this.writeToIframe("");
      return;
    }
    let fileHtml: string = "";
    this.fileService.convertFile(this.fileId).subscribe(html => {
      fileHtml = html.html;
      this.themeService.convertTheme(this.themeId).subscribe(css => {
        fileHtml += `<style>${css.css}</style>`;
        this.writeToIframe(fileHtml);
      });
    });
  }

  writeToIframe(content: string) {
    if (!this.iframe) {
      return;
    }

    const iframe = this.iframe.nativeElement;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();
  }
}
