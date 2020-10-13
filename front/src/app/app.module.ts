import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; /* Is needed for formBuilder */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; /* Is needed for material stuff */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';

import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { HttpClientModule } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { MismatchPasswordsValidatorDirective } from './shared/mismatch-passwords.directive';
import { SearchComponent } from './search/search.component';
import { SearchResultsComponent, FilterDialogComponent } from './search-results/search-results.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { ViewRoomsComponent } from './view-rooms/view-rooms.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotAcceptedHostComponent } from './not-accepted-host/not-accepted-host.component';
import { BookingMsgComponent } from './booking-msg/booking-msg.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    MismatchPasswordsValidatorDirective,
    SearchComponent,
    SearchResultsComponent,
    WelcomePageComponent,
    FilterDialogComponent,
    RoomDetailComponent,
    EditProfileComponent,
    AddRoomComponent,
    ViewRoomsComponent,
    AdminPanelComponent,
    UserProfileComponent,
    NotAcceptedHostComponent,
    BookingMsgComponent,
    EditRoomComponent,
    ChatComponent,
    ChatListComponent,
    ReservationListComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSliderModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatExpansionModule,
    MatPaginatorModule,
    GooglePlaceModule,
    HttpClientModule,
  ],
  entryComponents: [
    SearchResultsComponent,
    FilterDialogComponent,
  ],
  providers: [
    SearchComponent,
    SearchResultsComponent,
    HeaderComponent,
    DatePipe,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
