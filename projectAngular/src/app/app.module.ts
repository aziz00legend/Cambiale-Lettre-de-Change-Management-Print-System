import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitterModule } from 'primeng/splitter';
import { DragDropModule } from 'primeng/dragdrop';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';


// PrimeNG Services
import { MessageService, ConfirmationService } from 'primeng/api';

// Custom Components
import { HomeComponent } from './component/home/home.component';

import { LoginComponent } from './component/login/login.component';
import { InsideComponent } from './component/inside/inside.component';

import { FileUploadModule } from 'primeng/fileupload';

import { ColorPickerModule } from 'primeng/colorpicker';
import { SidebarModule } from 'primeng/sidebar';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NavbarComponent } from './component/navbar/navbar.component';
import { GraphQLModule } from './graphql.module';
import { BankManagementComponent } from './component/bank-management/bank-management.component';
import { SubsidiaryBankManagementComponent } from './component/subsidiary-bank-management/subsidiary-bank-management.component';
import { CompteManagementComponent } from './component/compte-management/compte-management.component';
import { InputMaskModule } from 'primeng/inputmask';
import { CambialeManagementComponent } from './component/cambiale-management/cambiale-management.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { DocumentComponent } from './component/document/document.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BeneficiaryComponent } from './component/beneficiary/beneficiary.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,

    LoginComponent,
    InsideComponent,
    BankManagementComponent,
    SubsidiaryBankManagementComponent,
    CompteManagementComponent,
    CambialeManagementComponent,
    DocumentComponent,
    BeneficiaryComponent


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, CardModule, InputMaskModule, InputNumberModule, PanelModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CalendarModule, ColorPickerModule, SidebarModule,
    AutoCompleteModule,
    ButtonModule,
    TagModule,
    CascadeSelectModule,
    TableModule,
    BreadcrumbModule,
    DialogModule,
    StepperModule,
    TabViewModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    ImageModule,
    ToolbarModule,
    DividerModule, FileUploadModule,

    SelectButtonModule, TagModule,

    SplitterModule, DragDropModule, ToastModule, ConfirmDialogModule, TreeTableModule, TreeModule, IconFieldModule, InputIconModule, MessagesModule

    , DragDropModule,

    ToastModule,
    ConfirmDialogModule,
    MessagesModule,

    TreeTableModule,
    TreeModule, ProgressSpinnerModule,
    InputTextModule,
    SplitButtonModule,
    IconFieldModule,
    InputIconModule,
    GraphQLModule, PdfViewerModule


  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
