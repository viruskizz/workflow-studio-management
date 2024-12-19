import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileResponse } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly baseUrl = `${environment.apiUrl}/files/`;

  constructor(private httpClient: HttpClient) { }

  upload(file: File, path?: string, name?: string) {
    const filename = name || file.name;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path || '/');
    formData.append('name', filename);
    return this.httpClient.post<FileResponse>(this.baseUrl, formData);
  }
}
