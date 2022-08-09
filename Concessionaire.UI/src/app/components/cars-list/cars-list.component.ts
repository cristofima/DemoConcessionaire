import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Car, CarRequest } from 'src/app/models/car.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cars-list',
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.scss']
})
export class CarsListComponent implements OnInit {

  cars: Car[] = [];
  formGroup?: FormGroup;
  displayDialog = false;
  carIdToEdit: number = 0;
  loadingTable = false;
  azureStorageBaseUrl = environment.azureStorageBaseUrl;

  @ViewChild('imageFileUpload', { static: false }) imageFileUpload?: FileUpload;
  @ViewChild('documentFileUpload', { static: false }) documentFileUpload?: FileUpload;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadingTable = true;
    this.apiService.getCars().subscribe({
      next: x => {
        this.cars = x;
        this.loadingTable = false;
      },
      error: () => {
        this.loadingTable = false;
      }
    });

    this.initForm();
  }

  private initForm() {
    this.formGroup = this.formBuilder.group({
      brand: new FormControl(null, Validators.required),
      model: new FormControl(null, Validators.required),
      year: new FormControl(null, Validators.required)
    });
  }

  editCar(car: Car) {
    this.displayDialog = true;
    this.carIdToEdit = car.id;

    this.formGroup?.controls['brand'].setValue(car.brand);
    this.formGroup?.controls['model'].setValue(car.model);
    this.formGroup?.controls['year'].setValue(car.year);
  }

  onSubmit() {
    this.spinner.show();
    let request: CarRequest = {
      ...this.formGroup?.value
    };

    if (this.imageFileUpload?.files.length) {
      request.image = this.imageFileUpload?.files[0];
    }

    if (this.documentFileUpload?.files.length) {
      request.technicalDataSheet = this.documentFileUpload?.files[0];
    }

    if (this.carIdToEdit) {
      this.apiService.updateCar(this.carIdToEdit, request).subscribe({
        next: car => {
          this.spinner.hide();
          var index = this.cars.findIndex(c => c.id == this.carIdToEdit);
          if (index >= 0) {
            this.cars[index] = car;
          }

          this.messageService.add({ severity: 'success', detail: 'Car updated' });
          this.carIdToEdit = 0;
          this.resetVariables();
        },
        error: () => {
          this.spinner.hide();
          this.messageService.add({ severity: 'danger', detail: 'Error updating car' });
        }
      });
    } else {
      this.apiService.addCar(request).subscribe({
        next: car => {
          this.spinner.hide();
          this.cars.push(car);
          this.messageService.add({ severity: 'success', detail: 'Car added' });
          this.resetVariables();
        },
        error: () => {
          this.spinner.hide();
          this.messageService.add({ severity: 'danger', detail: 'Error adding car' });
        }
      });
    }
  }

  private resetVariables() {
    this.displayDialog = false;
    this.imageFileUpload?.clear();
    this.documentFileUpload?.clear();
    this.formGroup?.reset();
  }

  deleteCar(car: Car) {
    this.confirmationService.confirm({
      message: `Are you sure you want delete the car with the following data?
        <br><b>Brand</b>: ${car.brand}<br><b>Model</b>: ${car.model}<br><b>Year</b>: ${car.year}`,
      accept: () => {
        this.spinner.show();
        this.apiService.deleteCar(car.id).subscribe({
          complete: () => {
            this.spinner.hide();
            this.cars = this.cars.filter(c => c.id != car.id);
            this.messageService.add({ severity: 'success', detail: 'Car deleted' });
          },
          error: () => {
            this.spinner.hide();
            this.messageService.add({ severity: 'danger', detail: 'Error deleting car' });
          }
        });
      },
    });
  }

  download(documentName: string) {
    fetch(`${this.azureStorageBaseUrl}/documents/${documentName}`)
      .then(resp => resp.blob())
      .then(blobobject => {
        const blob = window.URL.createObjectURL(blobobject);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = blob;
        anchor.download = documentName;
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(blob);
      })
      .catch(() => this.messageService.add({ severity: 'danger', detail: 'Error downloading the file' }));
  }

}
