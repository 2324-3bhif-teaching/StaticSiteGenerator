import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GlobalErrorHandlerService } from './global-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private baseService: BaseService,private errorHandler:GlobalErrorHandlerService) { }

  private filesURL: string = this.baseService.BASE_URL + this.baseService.FILES_URL;

  getAllFilesOfProject(projectId: number) {
    return this.http.get<SSGFile[]>(`${this.filesURL}/${projectId}`);
  }

  postFiles(files: File[], projectId: number) {
    const formData: FormData = new FormData();
    console.log(files)

    files.forEach(file => {
      formData.append('file', file);
    });

    formData.append('projectId', projectId.toString());
    return this.http.post(this.filesURL, formData);
  }

  deleteFile(fileId: number) {
    return this.http.delete(`${this.filesURL}/${fileId}`);
  }

  updateFileIndex(fileId: number, newIndex: number) {
    return this.http.patch(`${this.filesURL}/${fileId}`, { index: newIndex });
  }

  convertFile(fileId: number, projectId: number, generateTOC: boolean) {
    return this.http.get<{ html: string }>(`${this.filesURL}/convert/${fileId}/${projectId}/${generateTOC}`);
  }
}

export interface SSGFile {
  id: number,
  index: number,
  name: string
}
