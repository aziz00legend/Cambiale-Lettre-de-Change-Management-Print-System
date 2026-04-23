import { Component, OnInit, ViewChild } from '@angular/core';
import { CompteService } from '../../services/compte.service';
import { CompteDto, CompteSaveInput, CompteUpdateInput } from '../../entities/compte.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-compte-management',
  templateUrl: './compte-management.component.html',
  styleUrls: ['./compte-management.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CompteManagementComponent implements OnInit {

  comptes: CompteDto[] = [];
  filteredComptes: CompteDto[] = [];
  searchQuery: string = '';

  compte: Partial<CompteDto> = {};
  selectedCompte: CompteDto | null = null;

  dialogVisible = false;
  dialogTitle = 'Add Compte';
  isEdit = false;

  subsidiaryBankId = '5';
  codeSubsidiary = "";
  codeSuffix: string = '';
  ribValidationError: string = '';

  sortField: string = 'name';
  sortOrder: number = 1;

  @ViewChild('compteForm') compteForm!: NgForm;

  constructor(
    private compteService: CompteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
  }

  loadComptes(): void {
    this.compteService.getComptesBySubsidiaryBankId(this.subsidiaryBankId).subscribe({
      next: (data) => {
        this.comptes = [...data];
        this.applyFilters();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load comptes'
        });
      }
    });
  }

  applyFilters(): void {
    let list = [...this.comptes];

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.rib.toLowerCase().includes(q) ||
        c.cin.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const A = (a as any)[this.sortField]?.toLowerCase();
      const B = (b as any)[this.sortField]?.toLowerCase();
      return this.sortOrder === 1 ? A.localeCompare(B) : B.localeCompare(A);
    });

    this.filteredComptes = list;
  }

  /* RIB VALIDATION */
  validateRib(bank: string, branch: string, account: string, key: string): boolean {
    const full = bank + branch + account + key;
    let rem = 0;
    for (let char of full) rem = (rem * 10 + Number(char)) % 97;
    return rem === 0;
  }

  onRibChange(): void {
    this.ribValidationError = '';

    if (!this.codeSuffix) return;

    const full = `${this.codeSubsidiary}${this.codeSuffix}`.replace(/\s+/g, '');
    if (full.length !== 20) {
      this.ribValidationError = 'RIB must be exactly 20 digits';
      return;
    }

    const bank = full.substring(0, 2);
    const branch = full.substring(2, 5);
    const account = full.substring(5, 18);
    const key = full.substring(18, 20);

    if (!this.validateRib(bank, branch, account, key)) {
      this.ribValidationError = 'Invalid RIB checksum';
    }
  }

  resetForm(): void {
    this.compte = {};
    this.codeSuffix = '';
    this.ribValidationError = '';
    this.isEdit = false;

    if (this.compteForm) this.compteForm.resetForm();
  }

  openNew(): void {
    this.resetForm();
    this.dialogTitle = 'Add Compte';
    this.dialogVisible = true;
  }

  editCompte(c: CompteDto): void {
    const { __typename, ...clean } = c as any;
    this.compte = clean;

    this.isEdit = true;
    this.dialogTitle = 'Edit Compte';

    const parts = c.rib.split(' ');
    this.codeSuffix = parts.slice(1).join(' ');

    this.dialogVisible = true;
  }

  saveCompte(): void {
    if (!this.isEdit && this.ribValidationError) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ribValidationError });
      return;
    }

    if (this.isEdit && this.compte.id) {
      const input: CompteUpdateInput = {
        name: this.compte.name!,
        cin: this.compte.cin!,
        city: this.compte.city!,
        location: this.compte.location!,
        codePostal: this.compte.codePostal!
      };

      this.compteService.updateCompte(this.compte.id, input).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Compte updated' });
          this.loadComptes();
          this.dialogVisible = false;
        },
        error: err => this.handleGQLError(err)
      });
    } else {
      this.compte.rib = `${this.codeSubsidiary} ${this.codeSuffix}`;

      const input: CompteSaveInput = {
        rib: this.compte.rib!,
        name: this.compte.name!,

        cin: this.compte.cin!,
        city: this.compte.city!,
        location: this.compte.location!,
        codePostal: this.compte.codePostal!
      };

      this.compteService.addCompte(this.subsidiaryBankId, input).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Compte created' });
          this.loadComptes();
          this.dialogVisible = false;
        },
        error: err => this.handleGQLError(err)
      });
    }
  }

  confirmDeleteCompte(compte: CompteDto): void {
    this.confirmationService.confirm({
      message: `Delete compte ${compte.name}?`,
      accept: () => {
        this.compteService.deleteCompte(compte.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Compte deleted' });
            this.loadComptes();
          },
          error: err => this.handleGQLError(err)
        });
      }
    });
  }

  handleGQLError(error: any) {
    const msg =
      error?.error?.errors?.[0]?.message ??
      error?.message ??
      'Unknown GraphQL error';
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }
}
