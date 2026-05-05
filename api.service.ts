import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8002';

  constructor(private http: HttpClient) {}

  getProperties(filters?: {
    location?: string;
    min_price?: number;
    max_price?: number;
    status?: string;
    type?: string;
  }): Observable<Property[]> {
    let params = new HttpParams();
    if (filters?.location)  params = params.set('location', filters.location);
    if (filters?.min_price) params = params.set('min_price', filters.min_price);
    if (filters?.max_price) params = params.set('max_price', filters.max_price);
    if (filters?.status)    params = params.set('status', filters.status);
    if (filters?.type)      params = params.set('type', filters.type);
    return this.http.get<Property[]>(`${this.base}/properties`, { params });
  }

  getFeatured(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.base}/properties/featured`);
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.base}/properties/${id}`);
  }

  sendEnquiry(data: any): Observable<any> {
    return this.http.post(`${this.base}/enquiry`, data);
  }
}
