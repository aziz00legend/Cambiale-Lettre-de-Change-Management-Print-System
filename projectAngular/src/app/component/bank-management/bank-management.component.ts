// src/app/components/bank-management/bank-management.component.ts

import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { BankDto, BankSaveInput, BankUpdateInput } from '../../entities/bank.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SubsidiaryBankManagementComponent } from '../subsidiary-bank-management/subsidiary-bank-management.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bank-management',
  templateUrl: './bank-management.component.html',
  styleUrls: ['./bank-management.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class BankManagementComponent implements OnInit {
  banks: BankDto[] = [];
  bank: Partial<BankDto> = {};
  selectedBank: BankDto | null = null;
  bankDialog = false;
  dialogTitle = 'Add Bank';
  isEdit = false;
  @ViewChild('bankForm') bankForm!: NgForm;

  @ViewChild('subsidiaryBankManagementComponent') private subsidiaryBankManagementComponent!: SubsidiaryBankManagementComponent;

  sidebarVisible: boolean = false;


  constructor(
    private bankService: BankService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(): void {
    this.bankService.getAllBanks().subscribe({
      next: banks => {
        this.banks = [...banks];
      },
      error: err => {
        console.error('Failed to load banks:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load bank data from the server.',
        });
      }
    });
  }


  openSidebar(bank: BankDto) {
    this.subsidiaryBankManagementComponent.bankId = bank.id;
    this.subsidiaryBankManagementComponent.codeBank = bank.codeBank;
    this.subsidiaryBankManagementComponent.loadSubsidiaryBanks();

    this.sidebarVisible = true;
  }





  resetForm(): void {
    this.bank = {};
    this.isEdit = false;

    // Only reset form if available
    if (this.bankForm) {
      this.bankForm.resetForm(); // Clears the form controls and resets pristine state
    }
  }

  openNew(): void {
    this.resetForm();
    this.dialogTitle = 'Add Bank';
    this.bankDialog = true;
  }

  editBank(bank: BankDto): void {
    this.bank = this.cleanBankObject(bank);
    this.dialogTitle = 'Edit Bank';
    this.isEdit = true;
    this.bankDialog = true;


  }


  // Helper method to clean GraphQL objects
  private cleanBankObject(bank: BankDto): Partial<BankDto> {
    const { __typename, ...cleanBank } = bank as any;
    return cleanBank;
  }

  // Helper method to prepare update input
  private prepareBankUpdateInput(bank: Partial<BankDto>): BankUpdateInput {
    return {
      id: bank.id!,
      name: bank.name!,
      image: bank.image || '',
      abbreviation: bank.abbreviation || ''
    };
  }

  // Helper method to prepare save input
  private prepareBankSaveInput(bank: Partial<BankDto>): BankSaveInput {
    return {
      name: bank.name!,
      image: bank.image,
      codeBank: bank.codeBank!,
      abbreviation: bank.abbreviation
    };
  }

  saveBank(): void {
    if (this.isEdit && this.bank.id) {
      const updateInput = this.prepareBankUpdateInput(this.bank);
      this.bankService.updateBank(updateInput).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Bank updated successfully' });
          this.loadBanks();
          this.bankDialog = false;
        },
        error: (err) => {
          const errorMsg = this.extractGraphQLError(err);
          this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: errorMsg });
        }
      });
    } else {
      const saveInput = this.prepareBankSaveInput(this.bank);
      this.bankService.saveBank(saveInput).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Bank created successfully' });
          this.loadBanks();
          this.bankDialog = false;
        },
        error: (err) => {
          const errorMsg = this.extractGraphQLError(err);
          this.messageService.add({ severity: 'error', summary: 'Creation Failed', detail: errorMsg });
        }
      });
    }
  }


  private extractGraphQLError(error: any): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors[0]?.message || 'An unknown GraphQL error occurred.';
    }
    return error?.message || 'An unknown error occurred.';
  }


  confirmDeleteBank(bank: BankDto): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${bank.name}?`,
      accept: () => {
        this.bankService.deleteBank(bank.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Bank deleted successfully' });
            this.loadBanks();
          },
          error: (err) => {
            const errorMsg = this.extractGraphQLError(err);
            this.messageService.add({ severity: 'error', summary: 'Deletion Failed', detail: errorMsg });
          }
        });
      }
    });
  }


}