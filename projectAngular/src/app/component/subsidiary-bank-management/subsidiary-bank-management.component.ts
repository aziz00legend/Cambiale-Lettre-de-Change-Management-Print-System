import { Component, OnInit, ViewChild } from '@angular/core';
import { SubsidiaryBankService } from '../../services/subsidiary-bank.service';
import { SubsidiaryBankDto, SubsidiaryBankSaveInput, SubsidiaryBankUpdateInput } from '../../entities/subsidiary-bank.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CompteManagementComponent } from '../compte-management/compte-management.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subsidiary-bank-management',
  templateUrl: './subsidiary-bank-management.component.html',
  styleUrls: ['./subsidiary-bank-management.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class SubsidiaryBankManagementComponent implements OnInit {
  subsidiaryBanks: SubsidiaryBankDto[] = [];
  subsidiaryBank: Partial<SubsidiaryBankDto> = {};
  selectedSubsidiaryBank: SubsidiaryBankDto | null = null;
  dialogVisible = false;
  dialogTitle = 'Add Subsidiary Bank';
  isEdit = false;

  bankId = '4';
  codeBank = "";
  codeSuffix: string = '';

  @ViewChild('compteManagementComponent') private compteManagementComponent!: CompteManagementComponent;
  @ViewChild('subsidiaryForm') subsidiaryForm!: NgForm;


  sidebarVisible: boolean = false;

  constructor(
    private subsidiaryBankService: SubsidiaryBankService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

  }





  resetForm(): void {
    this.subsidiaryBank = {};
    this.codeSuffix = '';
    this.isEdit = false;

    if (this.subsidiaryForm) {
      this.subsidiaryForm.resetForm(); // Only safe in add mode
    }
  }



  openSidebar(subsidiaryBank: SubsidiaryBankDto) {
    this.compteManagementComponent.subsidiaryBankId = subsidiaryBank.id;
    this.compteManagementComponent.codeSubsidiary = subsidiaryBank.codeSubsidiary;
    this.compteManagementComponent.loadComptes();

    this.sidebarVisible = true;
  }


  loadSubsidiaryBanks(): void {
    this.subsidiaryBankService.getSubsidiaryBanksByBankId(this.bankId).subscribe({
      next: (data) => {
        this.subsidiaryBanks = [...data];
      },
      error: (err) => {
        console.error('Failed to load subsidiary banks:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load subsidiary bank data from the server.',
        });
      }
    });
  }

  openNew(): void {
    this.resetForm();
    this.dialogTitle = 'Add Subsidiary Bank';
    this.dialogVisible = true;
  }

  editSubsidiaryBank(sb: SubsidiaryBankDto): void {
    const { __typename, ...clean } = sb as any;
    this.subsidiaryBank = { ...clean }; // Set values first

    this.isEdit = true;
    this.dialogTitle = 'Edit Subsidiary Bank';

    // Parse code parts
    if (sb.codeSubsidiary) {
      const parts = sb.codeSubsidiary.split(' ');
      //this.codeBank = parts[0];
      this.codeSuffix = parts[1] || '';
    } else {
      this.codeSuffix = '';
    }



    this.dialogVisible = true;
  }

  saveSubsidiaryBank(): void {
    if (this.isEdit && this.subsidiaryBank.id) {
      const input: SubsidiaryBankUpdateInput = {
        name: this.subsidiaryBank.name!,
        location: this.subsidiaryBank.location!,
      };
      this.subsidiaryBankService.updateSubsidiaryBank(this.subsidiaryBank.id, input).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Subsidiary updated' });
          this.loadSubsidiaryBanks();
          this.dialogVisible = false;
        },
        error: (err) => {
          const errorMsg = this.extractGraphQLError(err);
          this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: errorMsg });
        }
      });
    } else {
      const fullCode = `${this.codeBank} ${this.codeSuffix}`;
      const input: SubsidiaryBankSaveInput = {
        codeSubsidiary: fullCode,
        name: this.subsidiaryBank.name!,
        location: this.subsidiaryBank.location!,
      };
      this.subsidiaryBankService.saveSubsidiaryBank(this.bankId, input).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Subsidiary created' });
          this.loadSubsidiaryBanks();
          this.dialogVisible = false;
        },
        error: (err) => {
          const errorMsg = this.extractGraphQLError(err);
          this.messageService.add({ severity: 'error', summary: 'Creation Failed', detail: errorMsg });
        }
      });
    }
  }

  confirmDeleteSubsidiaryBank(sb: SubsidiaryBankDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${sb.name}?`,
      accept: () => {
        this.subsidiaryBankService.deleteSubsidiaryBank(sb.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Subsidiary deleted' });
            this.loadSubsidiaryBanks();
          },
          error: (err) => {
            const errorMsg = this.extractGraphQLError(err);
            this.messageService.add({ severity: 'error', summary: 'Deletion Failed', detail: errorMsg });
          }
        });
      }
    });
  }

  private extractGraphQLError(error: any): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors[0]?.message || 'An unknown GraphQL error occurred.';
    }
    return error?.message || 'An unknown error occurred.';
  }

}
