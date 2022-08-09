export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  imagePath: string;
  technicalDataSheetPath: string;
}

export interface CarRequest {
  brand: string;
  model: string;
  year: number;
  image: File;
  technicalDataSheet: File;
}
