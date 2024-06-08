import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {Project} from "./project.service";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private baseService: BaseService) { }

  private filesURL: string = this.baseService.BASE_URL + this.baseService.FILES_URL;

  getAllFilesOfProject(projectId: number) {
    return this.http.get<SSGFile[]>(`${this.filesURL}/${projectId}`);
  }

  postFile(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('projectId', '1');

    return this.http.post(this.filesURL, formData);
  }
}

export interface SSGFile {
  id: number,
  index: number,
  name: string
}
