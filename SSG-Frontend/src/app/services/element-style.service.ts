import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElementStyleService {

  constructor(private http: HttpClient, private base: BaseService) { }

  private elementStylesUrl: string = this.base.BASE_URL + this.base.ELEMENTSTYLE_URL;

  getAllFromTheme(id: number){
    return this.http.get<ElementStyle[]>(`${this.elementStylesUrl}/themeId/${id}`);
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

export interface ElementStyleData{
  selector: string,
  themeId: number
};

export interface ElementStyle extends ElementStyleData{
  id: number
};
