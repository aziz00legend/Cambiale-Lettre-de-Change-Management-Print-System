import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryBankManagementComponent } from './subsidiary-bank-management.component';

describe('SubsidiaryBankManagementComponent', () => {
  let component: SubsidiaryBankManagementComponent;
  let fixture: ComponentFixture<SubsidiaryBankManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsidiaryBankManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubsidiaryBankManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
