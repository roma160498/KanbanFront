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
import {SidebarModule} from 'primeng/sidebar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { jqxKanbanComponent  } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import { NgxDnDModule } from '@swimlane/ngx-dnd'
import { DndListModule } from 'ngx-drag-and-drop-lists'
import {CalendarModule} from 'primeng/calendar';
import {ProgressBarModule} from 'primeng/progressbar';
import {KeyFilterModule} from 'primeng/keyfilter';
import {CheckboxModule} from 'primeng/checkbox';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
//import {MessageService} from 'primeng/components/common/messageservice';
import {DragDropModule} from 'primeng/dragdrop';
import {ListboxModule} from 'primeng/listbox';
import {InplaceModule} from 'primeng/inplace';
import {BlockUIModule} from 'primeng/blockui';

import { MentionModule } from 'angular-mentions/mention';

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
import { RoleService } from './services/role.service';
import { ProductPageComponent } from './components/product/product-page/product-page.component';
import { TableProductsComponent } from './components/product/table-products/table-products.component';
import { EditCreateProductComponent } from './components/product/edit-create-product/edit-create-product.component';
import { ProductService } from './services/product.service';
import { FeaturePageComponent } from './components/feature/feature-page/feature-page.component';
import { EditCreateFeatureComponent } from './components/feature/edit-create-feature/edit-create-feature.component';
import { TableFeatureComponent } from './components/feature/table-feature/table-feature.component';
import { FeatureService } from './services/feature.service';
import { IncrementPageComponent } from './components/increment/increment-page/increment-page.component';
import { EditCreateIncrementComponent } from './components/increment/edit-create-increment/edit-create-increment.component';
import { TableIncrementComponent } from './components/increment/table-increment/table-increment.component';
import { IncrementService } from './services/increment.service';
import { DateHelperService } from './services/date-helper.service';
import { IterationPageComponent } from './components/iteration/iteration-page/iteration-page.component';
import { EditCreateIterationComponent } from './components/iteration/edit-create-iteration/edit-create-iteration.component';
import { TableIterationsComponent } from './components/iteration/table-iterations/table-iterations.component';
import { IterationService } from './services/iteration.service';
import { SequenceHelperService } from './services/sequence-helper.service';
import { IssuePageComponent } from './components/issue/issue-page/issue-page.component';
import { TableIssuesComponent } from './components/issue/table-issues/table-issues.component';
import { EditCreateIssueComponent } from './components/issue/edit-create-issue/edit-create-issue.component';
import { IssueService } from './services/issue.service';
import { PermissionPageComponent } from './components/permission/permission-page/permission-page.component';
import { PermissionService } from './services/permission.service';
import { CommentService } from './services/comment.service';
import { CommentComponent } from './components/global/comment/comment.component';


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
    RelationshipTableComponent,
    ProductPageComponent,
    TableProductsComponent,
    EditCreateProductComponent,
    FeaturePageComponent,
    EditCreateFeatureComponent,
    TableFeatureComponent,
    jqxKanbanComponent,
    IncrementPageComponent, 
    EditCreateIncrementComponent, 
    TableIncrementComponent,
    IterationPageComponent,
    EditCreateIterationComponent,
    TableIterationsComponent, 
    IssuePageComponent, 
    TableIssuesComponent,
    EditCreateIssueComponent,
    PermissionPageComponent,
    CommentComponent
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
    TabViewModule,
    SidebarModule,
    AutoCompleteModule,
    OverlayPanelModule,
    InputTextareaModule,
    DndListModule,
    CalendarModule,
    ProgressBarModule,
    KeyFilterModule,
    CheckboxModule,
    DragDropModule,
    CardModule,
    MentionModule,
    ListboxModule,
    InplaceModule,
    DialogModule,
    BlockUIModule
    //NgxDnDModule
   // MessageService
    
  ],
  exports: [MatToolbarModule],
  providers: [LoggedInAuthGuardService, AuthenticateService, LoggedOutAuthGuardService, ComponentLoaderService, UserService, TeamService, RoleService, ProductService, FeatureService, IncrementService, DateHelperService, IterationService, SequenceHelperService, IssueService, PermissionService, CommentService],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [KanbanBoardComponent, ItemsToolbarComponent, TableTeamsComponent, UserPageComponent, TeamPageComponent, ProductPageComponent, FeaturePageComponent, IncrementPageComponent, IterationPageComponent, EditCreateIterationComponent, IssuePageComponent, PermissionPageComponent, EditCreateIssueComponent]
})
export class AppModule { }
