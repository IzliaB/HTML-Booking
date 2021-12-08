import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { scheduled } from 'rxjs';
import { BookingModel } from 'src/app/booking/models/booking.model';
import { DoctorModel } from 'src/app/booking/models/doctor.model';
import { BookingService } from 'src/app/booking/services/booking.service';
import { AttentionSchedule } from '../../home/model/IprofileDoctor';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GoBackModalComponent } from '../../../../go-back-modal/go-back-modal.component';
@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements OnInit {

  timeList: string[] = ['7:30am', '8:00am', '8:30am', '9:00am', '9:30am', '10:00am',];
  selectedTime: string = "";
  mapContainer: google.maps.Map | null;
  markers: google.maps.Marker[] = [];  

  place: any = {};

  get bookingModel(): BookingModel | undefined { return this.bookingService.bookingModel };

  get selectedAddress(): string | undefined { return this.bookingModel?.address };

  get doctor(): DoctorModel | undefined { return this.bookingModel?.doctor };

  get attentionSchedules(): AttentionSchedule[] | undefined { return this.bookingModel?.affiliate?.attentionSchedules };

  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;


  constructor(
    public bookingService: BookingService,
    private router: Router,
    public _activedRoute: ActivatedRoute,
    private toast: HotToastService,
    private location: Location,
    public dialog: MatDialog
  ) {
    this.mapContainer = null
  }

  ngOnInit(): void { 
    console.log('object A:>> ', this.bookingService.bookingModel); 
    console.log('doctor :>> ', this.doctor);
    this.bookingService.loadData();
    this.mapInit();

  }

  mapInit() {

    this.generateMarkers();

    var mapOptions = {
      zoom: 12,
      center: this.getCoordinatesMap(),
    }

    this.mapContainer = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);

    this.placeMarkers();
  }

  generateMarkers() {
    this.attentionSchedules?.forEach(schedule => {
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        position: this.scheduleToLatLng(schedule),
        clickable: true,
        // label: schedule.place.address,
      })

      this.markers.push(marker);
    });
  };

  getCoordinatesMap(): google.maps.LatLng {
    var latlng = new google.maps.LatLng(15.5039, -88.0139);

    if (this.markers.length > 0) {

      latlng = this.markers[0].getPosition()!;
    }
    return latlng;
  }

  changeDate(date: Date) {
    console.log('date :>> ', date);
    this.bookingService.bookingModel.appointmentDate = date;

  }
 
  onClickNext() {
    if (this.selectedAddress) {

      this.bookingService.saveData();
      this.router.navigate(['../fecha'], { relativeTo: this._activedRoute });
    }
    else {
      this.openSnackBar();
    }
  }

  goBack():void{
    this.dialog.open(GoBackModalComponent)
  }

  placeMarkers() {
    this.markers.forEach(marker => marker.setMap(this.mapContainer));
  }

  zoomToMarker(attentionSchedule: AttentionSchedule) {
    this.bookingService.bookingModel.address = attentionSchedule.place.address
    this.bookingService.bookingModel.address_id = attentionSchedule.place._id
    this.mapContainer?.panTo(this.scheduleToLatLng(attentionSchedule))
  }

  scheduleToLatLng(attentionSchedule: AttentionSchedule): google.maps.LatLng {
    return new google.maps.LatLng(attentionSchedule.place.loc.coordinates[1], attentionSchedule.place.loc.coordinates[0]);
  }

  

  openSnackBar() {
    this.toast.error('Seleccione Lugar!', { position: 'top-center', duration: 2000 });
  }

}
