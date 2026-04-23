import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component'; // Adjust as necessary
import { InsideComponent } from './component/inside/inside.component'; // Adjust as necessary
import { HomeComponent } from './component/home/home.component'; // Adjust as necessary
import { BankManagementComponent } from './component/bank-management/bank-management.component';
import { CambialeManagementComponent } from './component/cambiale-management/cambiale-management.component';
import { CambialePrintComponent } from './component/cambiale-print/cambiale-print.component';
import { BeneficiaryComponent } from './component/beneficiary/beneficiary.component';
import { DocumentComponent } from './component/document/document.component';





const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cambiale/print/:id', component: DocumentComponent },
  {
    path: 'inside', component: InsideComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'Bank', component: BankManagementComponent },
      { path: 'Cambiale', component: CambialeManagementComponent },
      { path: 'beneficiaries', component: BeneficiaryComponent },


      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
