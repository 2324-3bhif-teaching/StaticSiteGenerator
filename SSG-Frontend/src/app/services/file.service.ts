import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private baseService: BaseService) { }

  private filesURL: string = this.baseService.BASE_URL + this.baseService.FILES_URL;

  postFile(formData: any) {
    return this.http.post(this.filesURL, formData);
  }
}
