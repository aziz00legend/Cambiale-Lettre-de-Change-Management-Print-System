import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { HttpClient } from '@angular/common/http';
import { CambialeService } from '../../services/cambiale.service';
import { CambialeDtoDetail } from '../../entities/cambiale.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cambiale-viewer',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DocumentComponent {

  pdfSrc: string | null = null;
  pageNumber: number = 1;
  totalPages: number = 0;
  zoom = 0.9;
  cambialeId: string = "2";
  cambialeData: Partial<CambialeDtoDetail> | null = null;


  constructor(
    private cambialeService: CambialeService,
    private http: HttpClient,
    private message: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cambialeId = id;
      }
      this.previewCambiale(this.cambialeId);
    });
  }

  increaseZoom() {
    this.zoom = this.zoom + 0.1;
  }

  decreaseZoom() {
    this.zoom = this.zoom - 0.1;
  }




  loadCambialeData(fields: string[]) {
    if (!this.cambialeId) {
      alert('Please enter a Cambiale ID');
      return;
    }
    this.cambialeService.getCambialeById(this.cambialeId, fields).subscribe({
      next: (data) => {
        this.cambialeData = data;
      },
      error: (error) => {
        alert('Error loading cambiale data');
      }
    });
  }


  async fillCambialeTemplate(pdfDoc: PDFDocument, c: any): Promise<void> {

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.getPage(0);

    // ===== RIB =====
    if (c.donorAccountRib) {
      const full = c.donorAccountRib.replace(/\s+/g, '');
      const bank = full.substring(0, 2);
      const branch = full.substring(2, 5);
      const account = full.substring(5, 18);
      const key = full.substring(18, 20);

      page.drawText(bank, { x: 140, y: 772, size: 12, font: helvetica });
      page.drawText(branch, { x: 170, y: 772, size: 12, font: helvetica });
      page.drawText(account, { x: 205, y: 772, size: 12, font: helvetica });
      page.drawText(key, { x: 326, y: 772, size: 12, font: helvetica });

      page.drawText(bank, { x: 3, y: 648, size: 11, font: helvetica });
      page.drawText(branch, { x: 25, y: 648, size: 11, font: helvetica });
      page.drawText(account, { x: 70, y: 648, size: 11, font: helvetica });
      page.drawText(key, { x: 190, y: 648, size: 11, font: helvetica });
    }

    // ===== Protestable / Non protestable =====
    page.drawText(`X`, {
      x: c.protestable ? 253.7 : 236.5,
      y: 740,
      size: 10,
      font: helvetica
    });

    // ===== Donor info =====
    page.drawText(c.donorAccountName || '', { x: 6, y: 788, size: 10, font: helvetica });
    page.drawText(c.operationDateFr || '', { x: 133, y: 798, size: 10, font: helvetica });
    page.drawText(c.creationLocation || '', { x: 237, y: 813, size: 9, font: helvetica });
    page.drawText(c.creationDateFr || '', { x: 235, y: 799, size: 9, font: helvetica });

    // ===== Amount =====
    page.drawText(`${c.amount} DT`, { x: 390, y: 774, size: 12, font: helvetica });
    page.drawText(`${c.amount} DT`, { x: 245, y: 658, size: 7, font: helvetica });

    // ===== Beneficiary =====
    page.drawText(c.beneficiaryDrawer || '', { x: 6, y: 733, size: 10, font: helvetica });
    page.drawText(c.beneficiaryPayToOrderOf || '', { x: 125, y: 720, size: 11, font: helvetica });
    page.drawText(c.amountInLetters || '', { x: 6, y: 703, size: 11, font: helvetica });

    // ===== Dates / Locations =====
    page.drawText(c.operationDateFr || '', { x: 4, y: 678, size: 8, font: helvetica });
    page.drawText(c.creationDateFr || '', { x: 80, y: 678, size: 8, font: helvetica });
    page.drawText(c.creationLocation || '', { x: 165, y: 678, size: 9, font: helvetica });

    // ===== Donor bottom =====
    page.drawText(c.donorAccountName || '', { x: 215, y: 628, size: 10, font: helvetica });
    page.drawText(c.donorLocation || '', { x: 215, y: 598, size: 9, font: helvetica });

    // ===== Subsidiary =====
    page.drawText(c.nameSubsidiary || '', { x: 330, y: 648, size: 10, font: helvetica });
    page.drawText(c.locationSubsidiary || '', { x: 330, y: 633, size: 9, font: helvetica });
  }


  // =====================================================
  //  MODE 1 : PREVIEW (template + merged data)
  // =====================================================
  previewCambiale(id: string) {
    this.cambialeService.getCambialeById(id, ["referenceCode",
      "amount", "amountInLetters", "creationDateFr", "operationDateFr", "protestable",
      "creationLocation", "isPrinted", "nameSubsidiary", "locationSubsidiary",
      "donorAccountRib", "donorAccountName", "donorLocation", "beneficiaryDrawer", "beneficiaryPayToOrderOf"
    ]).subscribe(data => {
      this.cambialeData = data;
      this.buildPreviewPDF(data);
    });
  }

  async buildPreviewPDF(c: Partial<CambialeDtoDetail>) {
    const templateUrl = '/assets/Lettre de Change.pdf';

    const templateBytes = await this.http
      .get(templateUrl, { responseType: 'arraybuffer' })
      .toPromise();

    const pdfDoc = await PDFDocument.load(templateBytes!);
    pdfDoc.registerFontkit(fontkit);

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);


    await this.fillCambialeTemplate(pdfDoc, c)
    const page = pdfDoc.getPage(0);
    page.drawText(c.referenceCode || '', { x: 390, y: 807, size: 12, font: helvetica });


    const bytes = await pdfDoc.save();
    this.pdfSrc = await this.toBase64(bytes);
  }

  // =====================================================
  //  MODE 2 : PRINT (data only) with Confirmation
  // =====================================================
  printCambialeOnlyData(id: string) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir imprimer ce document ?',
      header: 'Confirmation d\'impression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.cambialeService.getCambialeById(id, [
          "amount", "amountInLetters", "creationDateFr", "operationDateFr", "protestable",
          "creationLocation", "isPrinted", "nameSubsidiary", "locationSubsidiary",
          "donorAccountRib", "donorAccountName", "donorLocation", "beneficiaryDrawer", "beneficiaryPayToOrderOf"
        ]).subscribe(data => {
          this.generateDataOnlyPDF(data);
        });
      }
    });
  }

  async generateDataOnlyPDF(c: Partial<CambialeDtoDetail>) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    await this.fillCambialeTemplate(pdfDoc, c);


    const bytes = await pdfDoc.save();
    this.printFile(bytes);
  }

  // =====================================================
  //  HELPERS
  // =====================================================
  private printFile(data: Uint8Array) {
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.print();

      // Mark as printed after print dialog
      this.markAsPrinted(this.cambialeId);

      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    };
  }

  markAsPrinted(id: string) {
    this.cambialeService.printCambiale(id).subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Imprimé',
          detail: 'Cambiale marquée comme imprimée.'
        });
      },
      error: () => {
        this.message.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de marquage comme imprimé.'
        });
      }
    });
  }

  private async toBase64(buffer: Uint8Array): Promise<string> {
    let binary = '';
    buffer.forEach(b => binary += String.fromCharCode(b));
    return `data:application/pdf;base64,${btoa(binary)}`;
  }

  afterLoad(pdf: any) {
    this.totalPages = pdf.numPages;
  }
}