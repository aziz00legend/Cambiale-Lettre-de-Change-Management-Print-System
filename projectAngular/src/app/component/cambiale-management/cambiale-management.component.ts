import { Component, OnInit } from '@angular/core';
import { CambialeService } from '../../services/cambiale.service';
import { CompteService } from '../../services/compte.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { CambialeDto, CambialeSaveDto, CambialeDtoDetail, TunisianGovernorate } from '../../entities/cambiale.model';
import { CompteDto } from '../../entities/compte.model';
import { BeneficiaryDto } from '../../entities/beneficiary.model';
import { MessageService } from 'primeng/api';

// Extended interface for display purposes
interface CompteWithDisplay extends CompteDto {
  display: string;
}

interface BeneficiaryWithDisplay extends BeneficiaryDto {
  display: string;
}

interface GovernorateOption {
  label: string;
  value: TunisianGovernorate;
}

@Component({
  selector: 'app-cambiale-management',
  templateUrl: './cambiale-management.component.html',
  styleUrls: ['./cambiale-management.component.scss'],
  providers: [MessageService]
})
export class CambialeManagementComponent implements OnInit {
  today: Date = new Date();
  donorAccounts: CompteWithDisplay[] = [];
  beneficiaries: BeneficiaryWithDisplay[] = [];
  governorates: GovernorateOption[] = [];

  cambiales: CambialeDto[] = [];

  dialogVisible = false;
  detailsDialogVisible = false;

  newCambiale: CambialeSaveDto = {
    amount: 0,
    operationDate: '',
    protestable: true,
    creationLocation: TunisianGovernorate.TUNIS,
    referenceCode: '',
    beneficiaryId: '',
    donorAccountId: ''
  };

  selectedCambialeDetails: CambialeDtoDetail | null = null;

  selectedDonor?: CompteWithDisplay;
  selectedBeneficiary?: BeneficiaryWithDisplay;
  selectedGovernorate?: GovernorateOption;

  filteredDonors: CompteWithDisplay[] = [];
  filteredBeneficiaries: BeneficiaryWithDisplay[] = [];
  filteredGovernorates: GovernorateOption[] = [];

  // For the date picker
  selectedDate: Date = new Date();

  // Loading state for details
  loadingDetails = false;

  constructor(
    private cambialeService: CambialeService,
    private compteService: CompteService,
    private beneficiaryService: BeneficiaryService,
    private messageService: MessageService
  ) {
    // Initialize governorates list
    this.governorates = Object.values(TunisianGovernorate).map(gov => ({
      label: this.formatGovernorate(gov),
      value: gov
    }));
  }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.compteService.getAllComptes().subscribe(accounts => {
      this.donorAccounts = accounts.map(c => ({
        ...c,
        display: `${c.name}  • RIB: ${c.rib}`
      }));
    });

    // Load beneficiaries (previously "RECEIVING" accounts)
    this.beneficiaryService.getAllBeneficiaries().subscribe(beneficiaries => {
      this.beneficiaries = beneficiaries.map(b => ({
        ...b,
        display: `${b.drawer} • ${b.payToOrderOf || 'N/A'}`
      }));
    });

    this.loadCambiales();
  }

  loadCambiales() {
    this.cambialeService.getCambiales().subscribe({
      next: (data) => {
        this.cambiales = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load cambiales.' });
        console.error('Error loading cambiales:', err);
      }
    });
  }

  openDialog() {
    this.dialogVisible = true;
    this.newCambiale = {
      amount: 0,
      operationDate: '',
      protestable: true,
      creationLocation: TunisianGovernorate.TUNIS,
      referenceCode: '',
      beneficiaryId: '',
      donorAccountId: ''
    };
    this.selectedDonor = undefined;
    this.selectedBeneficiary = undefined;
    this.selectedDate = new Date();
    this.selectedGovernorate = this.governorates.find(g => g.value === TunisianGovernorate.TUNIS);
  }

  openDetailsDialog(cambialeId: string) {
    this.loadingDetails = true;
    this.detailsDialogVisible = true;

    const fieldsToFetch = [
      'id',
      'amount',
      'amountInLetters',
      'creationDateFr',
      'operationDateFr',
      'protestable',
      'creationLocation',
      'referenceCode',
      'nameBank',
      'imageBank',
      'codeBank',
      'abbreviationBank',
      'codeSubsidiary',
      'nameSubsidiary',
      'locationSubsidiary',
      'beneficiaryDrawer',
      'beneficiaryPayToOrderOf',
      'donorAccountRib',
      'donorAccountName',
      'donorCin',
      'donorCity',
      'donorLocation',
      'donorCodePostal'
    ];

    this.cambialeService.getCambialeById(cambialeId, fieldsToFetch).subscribe({
      next: (details) => {
        this.selectedCambialeDetails = details as CambialeDtoDetail;
        this.loadingDetails = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load cambiale details.'
        });
        console.error('Error loading cambiale details:', err);
        this.loadingDetails = false;
        this.detailsDialogVisible = false;
      }
    });
  }

  closeDetailsDialog() {
    this.detailsDialogVisible = false;
    this.selectedCambialeDetails = null;
  }

  private formatDateToString(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatGovernorate(gov: TunisianGovernorate): string {
    return gov.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  saveCambiale() {
    if (!this.selectedDonor || !this.selectedBeneficiary || !this.selectedDate || !this.selectedGovernorate) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.' });
      return;
    }
    const selected = new Date(this.selectedDate);
    selected.setHours(0, 0, 0, 0);
    if (selected < this.today) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Operation date cannot be in the past.' });
      return;
    }

    this.newCambiale.donorAccountId = this.selectedDonor.id;
    this.newCambiale.beneficiaryId = this.selectedBeneficiary.id;
    this.newCambiale.operationDate = this.formatDateToString(this.selectedDate);
    this.newCambiale.creationLocation = this.selectedGovernorate.value;

    this.cambialeService.saveCambiale(this.newCambiale).subscribe({
      next: () => {
        this.dialogVisible = false;
        this.loadCambiales();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cambiale added successfully.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add cambiale.' });
        console.error('Error adding cambiale:', err);
      }
    });
  }

  deleteCambiale(id: string) {
    this.cambialeService.deleteCambiale(id).subscribe({
      next: () => {
        this.loadCambiales();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cambiale deleted successfully.' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete cambiale.' });
        console.error('Error deleting cambiale:', err);
      }
    });
  }

  filterDonors(event: any) {
    const query = event.query.toLowerCase();
    this.filteredDonors = this.donorAccounts.filter(c =>
      (c.name + c.rib).toLowerCase().includes(query)
    );
  }

  filterBeneficiaries(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(b =>
      (b.drawer + (b.payToOrderOf || '')).toLowerCase().includes(query)
    );
  }

  filterGovernorates(event: any) {
    const query = event.query.toLowerCase();
    this.filteredGovernorates = this.governorates.filter(g =>
      g.label.toLowerCase().includes(query)
    );
  }
}