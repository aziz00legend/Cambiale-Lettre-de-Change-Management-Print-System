import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambialePrintComponent } from './cambiale-print.component';

describe('CambialePrintComponent', () => {
  let component: CambialePrintComponent;
  let fixture: ComponentFixture<CambialePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambialePrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambialePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
