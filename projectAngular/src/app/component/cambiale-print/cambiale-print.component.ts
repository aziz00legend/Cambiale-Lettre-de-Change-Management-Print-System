import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CambialeDtoDetail } from '../../entities/cambiale.model';
import { CambialeService } from '../../services/cambiale.service';

@Component({
  selector: 'app-cambiale-print',
  templateUrl: './cambiale-print.component.html',
  styleUrls: ['./cambiale-print.component.scss']
})
export class CambialePrintComponent implements OnInit {
  cambialeId: string = '3';
  cambialeData: Partial<CambialeDtoDetail> | null = null;




  constructor(
    private route: ActivatedRoute,
    private cambialeService: CambialeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cambialeId = id;
      }
    });
  }



}