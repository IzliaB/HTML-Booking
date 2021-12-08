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

//moment.locale("es");

Swiper.use([Navigation, Pagination]);

const momentRange = extendMoment(moment);

const { split: splitRange } = require('moment-range-split');
@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {

  timeList: string[] = ['8:00', '9:00', '12:00'];
  selectedTime: string = ""
  initialDate = new Date();
  get selectedDate(): Date | undefined { return this.bookingService.bookingModel.appointmentDate };

  get bookingModel(): BookingModel | undefined { return this.bookingService.bookingModel };

  get doctor(): DoctorModel | undefined { return this.bookingService.bookingModel.doctor };

  get address(): string | undefined { return this.bookingService.bookingModel.address };

  get addressID(): string | undefined { return this.bookingService.bookingModel.address_id };

  get schedules(): any | undefined { return this.bookingService.bookingModel.schedules };

  get attentionSchedules(): AttentionSchedule[] | undefined { return this.bookingModel?.affiliate?.attentionSchedules };


  affiliate!: Affiliate;
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
    //let minDate = moment().startOf("day").format("YYYY-MM-DD")


    console.log('object :>> ', this.bookingService.bookingModel);
    console.log('doctor :>> ', this.doctor);
    console.log('place :>>', this.address);
    this.bookingService.loadData();
    //console.log('attentionSchedules :>>',  this.bookingService.bookingModel.affiliate?.attentionSchedules);
    //Mapeo el objeto para obtener la hora de inicio y almaceno en variable start
    // this.start = this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(initialTimeStr => initialTimeStr.initialTimeStr));
    // console.log('start', this.start);
    // //Mapeo el objeto para obtener la hora de inicio y almaceno en variable end
    // this.end = this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(finalTimeStr => finalTimeStr.finalTimeStr) );
    // console.log('end', this.end);
    // //Formateo las horas
    // let start = moment(this.start, "HH:mm");
    // let end = moment(this.end, "HH:mm");
    // //let diff = end.subtract(start);

    // console.log('let start', start);
    // console.log('let end', end);
    // //intento obtener el rango
    // let rangoHoras = momentRange.range(start, end);

    // rangoHoras.start.format('HH:mm');
    // rangoHoras.end.format('HH:mm');

    // console.log('range start', start);
    // console.log('range', rangoHoras);



    //  this.selectedPlace = this.bookingService.bookingModel.affiliate?.attentionSchedules.filter(schedule => schedule.place._id === this.addressID)
    console.log('hour :>>', this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(initialTimeStr => initialTimeStr.initialTimeStr)));
    console.log('hourEnd :>>', this.bookingService.bookingModel.affiliate?.attentionSchedules.map(schedule => schedule.schedules.map(finalTimeStr => finalTimeStr.finalTimeStr)));
    //   console.log('myplace :>>', this.selectedPlace);
    // console.log('bandera', this.bookingService.bookingModel.days = this.attentionSchedule.schedules.filter(days => days.days === this.days));
    //console.log('selectedPlace :>>', this.bookingService.bookingModel.affiliate?.attentionSchedules);

    this.selectedPlace = this.bookingService.bookingModel.affiliate?.attentionSchedules && this.bookingService.bookingModel.affiliate?.attentionSchedules.find((schedule) => schedule.place && schedule.place._id == this.addressID);

    // this.workDays = this.bookingService.extra

    console.log(this.selectedPlace);

    // if(this.selectedPlace){
    //   this.diasHabiles = this.getAvaibility();
    // }

    this.diasHabiles = this.getAvaibility();

    let day_name_full = moment().format('dddd');
    let day_name_three_letter = moment().format('ddd');
    let day1 = moment().format('dd');

    console.log('== To Get Day Name ==');
    console.log("using format('dddd') =>", day_name_full);
    console.log("using format('ddd') =>", day_name_three_letter);
    console.log('dd', day1);
    // console.log(this.diasHabiles);

    // if (this.selectedPlace) {
    // if (this._matCalendar) {
    //   this._matCalendar.updateTodaysDate();
    // }
    // }

    // let day = moment().day();
    // console.log('day', day);

    // this.disableDates = this.dateFilter(this.selectedPlace);
    //const markedDates = {};

    // this.disableDates.forEach((d: any) => {
    //   this.markedDates[d.format("YYYY-MM-DD")] = {
    //     disabled: true
    //   };
    // })

    // if (this.selectedDate) {
    //   this.markedDates[this._timeToString(this.selectedDate)] = { selected: true, marked: true };
    // }

    //this.fechasHabiles = this.getAvaibility();
    //console.log('habil', this.fechasHabiles);
  }

  _timeToString = (time: any) => {
    const date = new Date(time);
    return moment(date).utc().startOf("day").format("YYYY-MM-DD");
  }

  private getAvaibility() {
   // return ['MO'];

    let workingDays: string[] = [];
    if(this.selectedPlace && this.selectedPlace.schedules){
      //Entonces recorre el arreglo una vez por cada elemento del array
      this.selectedPlace.schedules.forEach((schedule: { days: any[]; }, index: any) => {
        //Y devolve la iteracion del recorrido del array y almacenalo el nuevo elemento obtenido en workingDays
        Object.keys(DaysOfWeek).forEach((key, index) => {
          if (schedule.days.some((day: string) => day == key)) {
            workingDays.some(alreadyAddedDay => alreadyAddedDay == key) ? null : workingDays.push(key)
          }
        })
      })
      console.log('Dias Habiles', workingDays);
     return workingDays;
    }
    else{
      return console.error('Ha ocurrido un error');
    }
  }


  dateFilter = (date: Date) => {

    // console.log(this.diasHabiles);
    //console.log(this.diasHabiles);
    return this.diasHabiles?.includes(moment(date).format('dd'));
    //let day1 = moment().format('dd');
    //  //Filtre el objeto para obtner los lugares seleccionados
    //  // const schedule = this.bookingService.bookingModel.affiliate?.attentionSchedules && this.bookingService.bookingModel.affiliate?.attentionSchedules.find((schedule) => schedule.place && schedule.place._id == this.addressID)
    //  // console.log('probando 1  :>>', schedule);
    //  let workingDays: string[] = [];
    //  //let currentDay = new Date;
    // //  //Posicionamiento del dia
    // //  currentDay.setDate(currentDay.getDate() - 1)
    // //  if (date < currentDay) {
    // //     return false;
    // //   }
    //   //Si se ha seleccionado un lugar
    //   if(this.selectedPlace && this.selectedPlace.schedules){
    //     //Entonces recorre el arreglo una vez por cada elemento del array
    //     this.selectedPlace.schedules.forEach((schedule: { days: any[]; }, index: any) => {
    //       //Y devolve la iteracion del recorrido del array y almacenalo el nuevo elemento obtenido en workingDays
    //       Object.keys(DaysOfWeek).forEach((key, index) => {
    //         if (schedule.days.some((day: string) => day == key)) {
    //           workingDays.some(alreadyAddedDay => alreadyAddedDay == key) ? null : workingDays.push(key)
    //         }
    //       })
    //     })
    //    return true;
    //   }
    //   console.log('workingDays', workingDays);

    //   let closedDays = Object.keys(DaysOfWeek).filter(key => !workingDays.includes(key));
    //   console.log('closedDays', closedDays);


    //   // Convierte 
    //   const start = moment(this._timeToString(date || this.selectedDate || new Date()), "YYYY-MM-DD").startOf("M");
    //   console.log('start', start);


    //   const end = moment(this._timeToString(date || this.selectedDate || new Date()), "YYYY-MM-DD").endOf("M");
    //   console.log('end', end);

    //   const datesRange = momentRange.range(start, end);
    //   console.log('datesRange', datesRange);

    //return false;

  }

  getSchedules = (selectedMonth: any) => {
    const schedule = this.bookingService.bookingModel.affiliate?.attentionSchedules && this.bookingService.bookingModel.affiliate?.attentionSchedules.find((schedule) => schedule.place && schedule.place._id == this.addressID)
    console.log('probando 1  :>>', schedule);
    let workingDays: string[] = [];
    if (schedule && schedule.schedules) {
      schedule.schedules.forEach((hourss, index) => {
        Object.keys(DaysOfWeek).forEach((key, index) => {
          if (hourss.days.some(day => day == key)) {
            workingDays.some(alreadyAddedDay => alreadyAddedDay == key) ? null : workingDays.push(key)
          }
        })
      })
    }
    console.log('workingDays', workingDays);

    let closedDays = Object.keys(DaysOfWeek).filter(key => !workingDays.includes(key));

    console.log('closedDays', closedDays);

    // Convierte 
    const start = moment(this._timeToString(selectedMonth || this.selectedDate || new Date()), "YYYY-MM-DD").startOf("M");
    console.log('start', start);

    const end = moment(this._timeToString(selectedMonth || this.selectedDate || new Date()), "YYYY-MM-DD").endOf("M");
    console.log('end', end);

    const datesRange = momentRange.range(start, end);
    console.log('datesRange', datesRange);

    const disableDates = splitRange(datesRange, "days")
      .map((r: any) => r.start).filter((d: any) => {
        return closedDays.includes(isoWeek[d.isoWeekday() - 1]);
      });
    return { workingDays, closedDays, disableDates: disableDates }
    //console.log('disable', disableDates);
  }

  getDoctorId() {
    this.doctorId = this._activedRoute.snapshot.params['id'];
    console.log('getDoctor :>> ', this.doctorId);
  };

  changeDate = (date: Date) => {
    console.log('date :>> ', date);
    this.bookingService.bookingModel.appointmentDate = date;
  }

  getNextMonth(): Date {
    var tempDate = new Date();
    var newDate = new Date(tempDate.setMonth(tempDate.getMonth() + 1));
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

  setTime(time: string) {
    this.selectedTime = time;

    let start = moment()

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

const isoWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];