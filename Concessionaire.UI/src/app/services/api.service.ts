import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Car, CarRequest } from '../models/car.model';
import { FormUtil } from '../utils/form.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getCars() {
    return this.http.get<Car[]>(`${environment.baseUrl}/api/Cars`);
  }

  getCar(id: number) {
    return this.http.get<Car>(`${environment.baseUrl}/api/Cars/${id}`);
  }

  addCar(request: CarRequest) {
    const formData = FormUtil.buildFormData(request);
    return this.http.post<Car>(`${environment.baseUrl}/api/Cars`, formData);
  }

  updateCar(id: number, request: CarRequest) {
    const formData = FormUtil.buildFormData(request);
    return this.http.put<Car>(`${environment.baseUrl}/api/Cars/${id}`, formData);
  }

  deleteCar(id: number) {
    return this.http.delete(`${environment.baseUrl}/api/Cars/${id}`);
  }
}
