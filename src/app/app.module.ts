import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {Routes, RouterModule} from '@angular/router';

import { HttpClientModule } from '@angular/common/http'; 

import {MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularSplitModule } from 'angular-split';
import {AccordionModule} from 'primeng/accordion';  
import {MenuItem} from 'primeng/api';     
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {PasswordModule} from 'primeng/password';
import {TabViewModule} from 'primeng/tabview';

//import {MessageService} from 'primeng/components/common/messageservice';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { LoggedInAuthGuardService } from './services/logged-in-auth-guard.service';
import { LoggedOutAuthGuardService } from './services/logged-out-auth-guard.service';
import { AuthenticateService } from './services/authenticate.service';
import { ComponentLoaderService } from './services/component-loader.service'
import { UserService } from './services/user.service'
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js';
import { ItemsToolbarComponent } from './components/items-toolbar/items-toolbar.component';
import { TableTeamsComponent } from './components/team/table-teams/table-teams.component';
import { TableUsersComponent } from './components/user/table-users/table-users.component';
import { EditCreateUserComponent } from './components/user/edit-create-user/edit-create-user.component';
import { UserPageComponent } from './components/user/user-page/user-page.component';
import { TeamPageComponent } from './components/team/team-page/team-page.component';
import { TeamService } from './services/team.service';
import { EditCreateTeamComponent } from './components/team/edit-create-team/edit-create-team.component';
import { RelationshipTableComponent } from './components/global/relationship-table/relationship-table.component';

// определение маршрутов
const appRoutes: Routes =[
  {path: 'login', component: LoginFormComponent, canActivate: [LoggedOutAuthGuardService]},
  {path: 'admin', component: AdminFormComponent, canActivate: [LoggedInAuthGuardService]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    KanbanBoardComponent,
    ItemsToolbarComponent,
    TableTeamsComponent,
    AdminFormComponent,
    TableUsersComponent,
    EditCreateUserComponent ,
    UserPageComponent,
    TeamPageComponent,
    EditCreateTeamComponent,
    RelationshipTableComponent   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MDBBootstrapModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    AngularSplitModule,
    ButtonModule,
    AccordionModule,
    TableModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    PanelModule,
    PasswordModule,
    TabViewModule
   // MessageService
    
  ],
  exports: [MatToolbarModule],
  providers: [LoggedInAuthGuardService, AuthenticateService, LoggedOutAuthGuardService, ComponentLoaderService, UserService, TeamService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [KanbanBoardComponent, ItemsToolbarComponent, TableTeamsComponent, UserPageComponent, TeamPageComponent]
})
export class AppModule { }
