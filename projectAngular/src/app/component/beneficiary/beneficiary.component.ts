import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BeneficiaryDto, BeneficiarySaveInput, BeneficiaryUpdateInput } from '../../entities/beneficiary.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class BeneficiaryComponent implements OnInit {

  beneficiaries: BeneficiaryDto[] = [];
  filteredBeneficiaries: BeneficiaryDto[] = [];
  searchTerm: string = "";

  formVisible: boolean = false;
  form: FormGroup;
  editing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: BeneficiaryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      id: [null],
      drawer: ['', Validators.required],
      payToOrderOf: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.service.getAllBeneficiaries().subscribe(res => {
      this.beneficiaries = res;
      this.filteredBeneficiaries = res;
    });
  }

  filterList() {
    const term = this.searchTerm.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(b =>
      b.drawer.toLowerCase().includes(term) ||
      b.payToOrderOf.toLowerCase().includes(term)
    );
  }

  openNew() {
    this.form.reset();
    this.editing = false;
    this.formVisible = true;
  }

  openEdit(b: BeneficiaryDto) {
    this.editing = true;
    this.form.patchValue(b);
    this.formVisible = true;
  }

  save() {
    if (this.form.invalid) return;

    if (!this.editing) {
      const input: BeneficiarySaveInput = {
        drawer: this.form.value.drawer,
        payToOrderOf: this.form.value.payToOrderOf
      };

      this.service.saveBeneficiary(input).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Beneficiary added' });
        this.formVisible = false;
        this.loadAll();
      });

    } else {
      const input: BeneficiaryUpdateInput = {
        id: this.form.value.id,
        drawer: this.form.value.drawer,
        payToOrderOf: this.form.value.payToOrderOf
      };

      this.service.updateBeneficiary(input).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Beneficiary updated' });
        this.formVisible = false;
        this.loadAll();
      });
    }
  }

  delete(b: BeneficiaryDto) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: `Are you sure you want to delete <strong>${b.drawer}</strong>?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      defaultFocus: 'reject',
      accept: () => {
        this.service.deleteBeneficiary(b.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted Successfully',
              detail: `Beneficiary "${b.drawer}" has been removed`,
              life: 3000
            });
            this.loadAll();
          },
          error: (err) => {
            console.error('Error deleting beneficiary:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: 'An error occurred while deleting the beneficiary. Please try again.',
              life: 5000
            });
          }
        });
      },
      reject: () => {
        // Optional: Show cancellation message
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete operation cancelled',
          life: 2000
        });
      }
    });
  }
}
