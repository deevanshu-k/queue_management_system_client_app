import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueueComponent } from './add-queue.component';

describe('AddQueueComponent', () => {
  let component: AddQueueComponent;
  let fixture: ComponentFixture<AddQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddQueueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
