import { Component, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-add-queue',
  standalone: true,
  imports: [CardModule,FormsModule],
  templateUrl: './add-queue.component.html',
  styleUrl: './add-queue.component.css',
})
export class AddQueueComponent {
  @Input({ alias: 'queue', required: true }) queue!: {
    topic: string;
    type: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    managername: string;
    startdate: string;
    starttime: string;
  };
  // @Output("queue") queueEmitter
}
