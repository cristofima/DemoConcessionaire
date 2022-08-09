import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarsListComponent } from './components/cars-list/cars-list.component';

const routes: Routes = [
  {
    path: 'cars',
    component: CarsListComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'cars'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
