import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { ElementStyle, ElementStyleData } from '../components/theme-editor/theme-editor.component';

@Injectable({
  providedIn: 'root'
})
export class ElementStyleService {

  constructor(private http: HttpClient, private base: BaseService) { }

  private elementStylesUrl: string = this.base.BASE_URL + this.base.ELEMENTSTYLE_URL;

  getAllFromTheme(id: number){
    return this.http.get<ElementStyle[]>(`${this.elementStylesUrl}/${id}`);
  }

  postElementStyle(elementStyle: ElementStyleData){
    return this.http.post(`${this.elementStylesUrl}`, elementStyle);
  }

  patchElementStyleSelector(id: number, newSelector: string){
    return this.http.patch(`${this.elementStylesUrl}/${id}`, {newSelector: newSelector});
  }

  deleteElementStyle(id: number){
    return this.http.delete(`${this.elementStylesUrl}/${id}`);
  }
}
