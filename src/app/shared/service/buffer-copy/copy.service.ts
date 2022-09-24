import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  constructor() { }
  public copyValue(value:any) {
    navigator.clipboard.writeText(value);
  }
}
