import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectAddressComponent } from './select-address.component';
import { MatDividerModule } from '@angular/material/divider';
import { DoktoLayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DoctorAtClinicRoutingModule } from '../doctor-at-clinic-routing.module';



@NgModule({
  declarations: [
    SelectAddressComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MatCardModule,
    MatCheckboxModule,
    DoktoLayoutModule,
    MatDividerModule,
    SharedModule,
    MatIconModule,
    MatRippleModule,
    DoctorAtClinicRoutingModule
  ]
})
export class SelectAddressModule { }
