import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from 'src/app/search-results/search-results.component';
import { WelcomePageComponent } from 'src/app/welcome-page/welcome-page.component';
import { RoomDetailComponent } from 'src/app/room-detail/room-detail.component';
import { EditProfileComponent } from 'src/app/edit-profile/edit-profile.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { ViewRoomsComponent } from './view-rooms/view-rooms.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditRoomComponent } from './edit-room/edit-room.component';
import { ChatComponent } from './chat/chat.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: WelcomePageComponent },
  { path: 'search-results/:location/:fromdate/:todate/:adults/:children/:advancedSearch', component: SearchResultsComponent },
  { path: 'room-detail', component: RoomDetailComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'add-room', component: AddRoomComponent },
  { path: 'view-rooms', component: ViewRoomsComponent },
  { path: 'edit-room', component: EditRoomComponent },
  { path: 'admin-panel', component: AdminPanelComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat-list', component: ChatListComponent },
  { path: 'reservations', component: ReservationListComponent },
  { path: '**', component: WelcomePageComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}