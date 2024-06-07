import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private baseService: BaseService) { }

  private filesURL: string = this.baseService.BASE_URL + this.baseService.FILES_URL;

  postFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('projectId', '1');

    return this.http.post(this.filesURL, formData);
  }
}
