import { Injectable } from '@angular/core';
import { ByPassDto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BypassErrorService {
  private _serverErrorbypassList: ByPassDto[];
  private _clientErrorbypassList: ByPassDto[];

  constructor() {
    this._serverErrorbypassList = [];
    this._clientErrorbypassList = [];
  }

  private _getObjectInBypassList(list: ByPassDto[], url: string): ByPassDto {
    const bypassObject = list.find(bypass => bypass.url === url);
    return bypassObject;
  }
  private _removeObjectFromBypassList(list: ByPassDto[], bypassObject: ByPassDto): void {
    const anIndex = list.indexOf(bypassObject);
    if (list.length && anIndex !== -1) {
      list.splice(anIndex, 1);
    }
  }

  public bypassError(urlString: string, statusCodes: number[]) {
    const clientErrorCodes = statusCodes.filter(code => code.toString().startsWith('4'));
    const serverErrorCodes = statusCodes.filter(code => code.toString().startsWith('5'));
    if (serverErrorCodes) {
      this._addToServerErrorBypassList(urlString, serverErrorCodes);
    }

    if (clientErrorCodes) {
      this._addToClientErrorBypassList(urlString, clientErrorCodes);
    }
  }

  private _addToServerErrorBypassList(url: string, status: number[]): void {
    this._serverErrorbypassList.push({ url, status });
  }

  public getObjectServerErrorBypassList(url: string): ByPassDto {
    return this._getObjectInBypassList(this._serverErrorbypassList, url);
  }

  public removeErrorServerErrorBypassList(bypassObject: ByPassDto): void {
    this._removeObjectFromBypassList(this._serverErrorbypassList, bypassObject);
    console.debug('this._serverErrorbypassList', this._serverErrorbypassList);
  }

  private _addToClientErrorBypassList(url: string, status: number[]): void {
    this._clientErrorbypassList.push({ url, status });
  }

  public getObjectClientErrorBypassList(url: string): ByPassDto {
    return this._getObjectInBypassList(this._clientErrorbypassList, url);
  }

  public removeObjectClientErrorBypassList(bypassObject: ByPassDto): void {
    this._removeObjectFromBypassList(this._clientErrorbypassList, bypassObject);
    console.debug('this._clientErrorbypassList', this._clientErrorbypassList);
  }
}
