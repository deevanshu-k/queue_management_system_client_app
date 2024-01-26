import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueCardComponent } from './queue-card.component';

describe('QueueCardComponent', () => {
  let component: QueueCardComponent;
  let fixture: ComponentFixture<QueueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueueCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QueueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
