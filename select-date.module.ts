import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDateComponent } from './select-date.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DoctorAtHomeRoutingModule } from '../doctor-at-home-routing.module';
import { SwiperModule } from 'swiper/angular';
import { MatButtonModule } from '@angular/material/button';
import { DoktoLayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { DoctorAtClinicRoutingModule } from '../../doctor-at-clinic/doctor-at-clinic-routing.module';



@NgModule({
  declarations: [
    SelectDateComponent,
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    DoctorAtHomeRoutingModule,
    SwiperModule,
    DoktoLayoutModule,
    SharedModule,
    MatIconModule,
    MatRippleModule,
    DoctorAtClinicRoutingModule
  ]
})
export class SelectDateModule { }
