import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DoctorModel } from 'src/app/booking/models/doctor.model';
import { BookingService } from 'src/app/booking/services/booking.service';
import Swiper, { Pagination, Navigation, Autoplay, Lazy, SwiperOptions, } from 'swiper';
import * as moment from 'moment'
import { BookingModel } from 'src/app/booking/models/booking.model';
import { Affiliate, profileAffiliate } from '../../home/model/IprofileDoctor';
import { MatCalendar } from '@angular/material/datepicker';
import { Moment } from 'moment';
//import * as moment from 'moment';
import { AttentionSchedule } from '../../home/model/IprofileDoctor';
import { Location } from '@angular/common';
import { extendMoment } from 'moment-range';
//import { extendMoment } from ''
//import { split } from 'node_modules/moment-range-split/lib/'
import { AffiliateAvailability } from '../../home/model/affiliateAvailabilityI';

//moment.locale("es");

Swiper.use([Navigation, Pagination]);

const range = extendMoment(moment);

const { split } = require('moment-range-split');
@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {

  timeList: string[] = ['8:00', '9:00', '12:00'];
  selectedTime: string = ""
  initialDate = new Date();
  get selectedDate(): any | undefined { return this.bookingService.bookingModel.appointmentDate };

  get bookingModel(): BookingModel | undefined { return this.bookingService.bookingModel };

  get doctor(): DoctorModel | any { return this.bookingService.bookingModel.doctor };

  get address(): string | undefined { return this.bookingService.bookingModel.address };

  get addressID(): string | any { return this.bookingService.bookingModel.address_id };

  get schedules(): any | undefined { return this.bookingService.bookingModel.schedules };

  get attentionSchedules(): AttentionSchedule[] | undefined { return this.bookingModel?.affiliate?.attentionSchedules };


  affiliate!: Affiliate;
  availability!: AffiliateAvailability;
  selectedPlace: any;
  days!: string[];
  doctorId = "";
  place: any = {};
  date!: Date;
  hours!: string[];

  start!: any;
  end!: any;

  minDate: any = {};
  maxDate!: Moment;

  workDays!: string;

  disableDates: any = [];
  markedDates: any = {};

  enabledSchedule: any = {};

  str!: string;

  horas!: moment.Moment[];
  diasHabiles!: any;

  attentionSchedule!: AttentionSchedule

  @ViewChild(MatCalendar)
  _matCalendar!: MatCalendar<Date>;

  swiperConfig: SwiperOptions = {
    slidesPerView: 4,
    centeredSlides: true,
    spaceBetween: 20,
    breakpoints: {
      // when window width is >= 640px
      640: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  }

  constructor(
    public bookingService: BookingService,
    private router: Router,
    public _activedRoute: ActivatedRoute,
    private toast: HotToastService,
    private location: Location,
  ) {
    //this.minDate = moment().startOf("day").format("YYYY-MM-DD");
    //console.log(this.minDate);
  }

  // calculateRange(start: string, end: string, minutes: string){
  //   let range = [];
  //   for(let hour = moment(start); hour.isBefore(end); hour.add(minutes, 'minutes')){
  //     range.push(moment(end))
  //   }
  //   range.push(moment(end));
  //   return range;
  // }

  ngOnInit(): void {
    console.log('object :>> ', this.bookingService.bookingModel);
    console.log('doctor :>> ', this.doctor);
    console.log('place :>>', this.address);
    this.bookingService.loadData();
    console.log('attentionSchedules :>>',  this.bookingService.bookingModel.affiliate?.attentionSchedules);

    this.selectedPlace = this.bookingService.bookingModel.affiliate?.attentionSchedules && this.bookingService.bookingModel.affiliate?.attentionSchedules.find((schedule) => schedule.place && schedule.place._id == this.addressID);
    console.log('lugar', this.selectedPlace);

    this.diasHabiles = this.getAvaibility();

    this.hourFilter();

    //let date = this.date

    //this.getAvailability(moment(date).format());
  }

  private getAvaibility() {
   //return ['Mo'];
    let workingDays: string[] = [];
    if(this.selectedPlace && this.selectedPlace.schedules){
      //Entonces recorre el arreglo una vez por cada elemento del array
      this.selectedPlace.schedules.forEach((schedule: { days: any[]; }, index: any) => {
        //Y devolve la iteracion del recorrido del array y almacenalo el nuevo elemento obtenido en workingDays
        Object.keys(DaysOfWeek).forEach((key, index) => { //Lo trato como objeto DaysOfWeek
          if (schedule.days.some((day: string) => day == key)) {
            workingDays.some(alreadyAddedDay => alreadyAddedDay == key) ? null : workingDays.push(key)
          }
        })
      })
      //Ahora que ya se itero el array, convertimo la primera palabra del array a Mayuscula y lo demas en minus
      //Ya que asi lo requiere la lib Moment JS
      let days  = workingDays
      var newArr = days.map(el => {
        const temp = el.charAt(0).toUpperCase() + el.slice(1).toLowerCase();
        return temp;
      })
      console.log('Dias Habiles', newArr);
     return newArr;
    }
    else{
      return console.error('Ha ocurrido un error');
    }
  }

  getAvailability(date:any){
    this.bookingService.getAffiliateAvailability(this.doctor?.id, this.addressID, date)
      .subscribe(res => {
       this.start = res.schedules.map(start => start.initialTimeStr);
       this.end = res.schedules.map(end => end.finalTimeStr);
       console.log('start1', this.start);
       console.log('end1', this.end);
      }, (error => {
       console.error(error)
      }))
  }

  hourFilter(){

   // let date: Date;
    let end: any;
    let start: any;
    end = this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(finalTimeStr => finalTimeStr.finalTimeStr))
    start = this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(initialDate => initialDate.initialTimeStr))
  
    this.start = new Date(2021, 11, 8, end);
    //console.log('starrrrrr', start);
    this.end = new Date(2021, 11, 8, start);

    let rangoHoras = range(this.start, this.end);
    console.log(rangoHoras);

    this.horas = split(rangoHoras, "hours");

    console.log('horas probando', this.horas);
  }
  

  dateFilter = (date: Date) => {
    //Formateamos el dia con moment js
    return this.diasHabiles?.includes(moment(date).format('dd'));
  }

  getDoctorId() {
    this.doctorId = this._activedRoute.snapshot.params['id'];
    console.log('getDoctor :>> ', this.doctorId);
  };

  changeDate = (date: any) => {
    console.log('date :>> ', date);
    this.bookingService.bookingModel.appointmentDate = date;
  }

  getNextMonth(): Date {
    var tempDate = new Date();
    var newDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
    //this.diasHabiles = newDate;
    return newDate;
  }

  onClickNext() {
    if (this.selectedDate) {

      this.bookingService.saveData();
      this.router.navigate(['../detalle'], { relativeTo: this._activedRoute });
    }
    else {
      this.openSnackBar();
    }
  }

  //Metodo que llena la iteracion
  setTime(time: string) {
    this.selectedTime = time;

   // let start = moment()

    //this.convertToDatetime();
  }

  convertToDatetime() {
    var formattedDate = this.selectedDate?.toLocaleDateString("en-US");
    var dt: Date = new Date(formattedDate + " " + this.selectedTime);
    this.bookingService.bookingModel.appointmentDate = dt;
  }

  openSnackBar() {
    this.toast.error('Seleccione Fecha!', { position: 'top-center', duration: 2000 });
  }

  getDoctorName = () => {
    return this.doctor?.fullName
  };

  goBack(): void {
    this.location.back();
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }

  onSlideChange() {
  }

}

enum DaysOfWeek {
  "MO" = 1,
  "TU" = 2,
  "WE" = 3,
  "TH" = 4,
  "FR" = 5,
  "SA" = 6,
  "SU" = 7,
}