import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Queue } from '../../../services/viewer-socket.service';
import { ManagerService } from '../../../services/manager.service';

@Component({
  selector: 'app-queue-card',
  standalone: true,
  imports: [CardModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './queue-card.component.html',
  styleUrl: './queue-card.component.css',
})
export class QueueCardComponent implements OnChanges {
  @Input({ required: true, alias: 'queuedata' }) queueData!: Queue;
  queue?: {
    topic: string;
    type: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    status: 'PENDING' | 'ONGOING' | 'COMPLETED';
    managername: string;
    startdate: string;
    starttime: string;
  };

  @Output('fetchqueuedata') fetchQueueData: EventEmitter<void> =
    new EventEmitter<void>();

  constructor(private managerService: ManagerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.queueData)
      this.queue = {
        topic: this.queueData.topic,
        type: this.queueData.type,
        managername: this.queueData.managername,
        status: this.queueData.status,
        startdate: this.queueData.startdate,
        starttime: this.queueData.starttime,
      };
  }

  resetQueueData() {
    if (this.queueData) {
      this.queue = {
        topic: this.queueData.topic,
        type: this.queueData.type,
        managername: this.queueData.managername,
        status: this.queueData.status,
        startdate: this.queueData.startdate,
        starttime: this.queueData.starttime,
      };
    }
  }

  saveQueueData() {
    if (
      this.queue &&
      this.queue.topic &&
      this.queue.type &&
      this.queue.status &&
      this.queue.starttime &&
      this.queue.startdate &&
      this.queue.managername
    ) {
      // Save Data
      this.managerService.updateQueueData(this.queue).subscribe({
        next: (data) => {
          this.fetchQueueData.emit();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
    }
  }
}
