import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambialeManagementComponent } from './cambiale-management.component';

describe('CambialeManagementComponent', () => {
  let component: CambialeManagementComponent;
  let fixture: ComponentFixture<CambialeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambialeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CambialeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
