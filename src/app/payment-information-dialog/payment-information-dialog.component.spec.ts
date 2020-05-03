import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInformationDialogComponent } from './payment-information-dialog.component';

describe('PaymentInformationDialogComponent', () => {
  let component: PaymentInformationDialogComponent;
  let fixture: ComponentFixture<PaymentInformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInformationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
