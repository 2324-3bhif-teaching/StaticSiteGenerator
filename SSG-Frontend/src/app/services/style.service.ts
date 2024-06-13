import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { style } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class StyleService {

  constructor(private http: HttpClient, private baseService: BaseService) { }

  private stylesUrl: string = this.baseService.BASE_URL + this.baseService.STYLE_URL;

  getAllStylesOfElementStyle(elementStyleId: number){
    console.log(`${this.stylesUrl}/elementStyle/${elementStyleId}`);
    return this.http.get<Style[]>(`${this.stylesUrl}/elementStyle/${elementStyleId}`);
  }

  postStyle(data: StyleData){
    return this.http.post(this.stylesUrl + "/", data);
  }

  patchStyleProperty(id:number, newProperty: string){
    return this.http.patch(`${this.stylesUrl}/${id}/property`, {newProperty: newProperty});
  }

  patchStyleValue(id: number, newValue: string){
    return this.http.patch(`${this.stylesUrl}/${id}/value`, {newValue: newValue});
  }

  deleteStyle(id: number){
    return this.http.delete(`${this.stylesUrl}/${id}`);
  }
}

export interface StyleData{
  elementStyleId: number,
  property: string,
  value: string
}

export interface Style extends StyleData{
  id: number,
}
