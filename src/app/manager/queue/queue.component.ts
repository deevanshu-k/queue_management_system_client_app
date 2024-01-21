import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager.service';
import { Queue } from '../../services/viewer-socket.service';

export interface Candidate {
  id: string;
  candidate_id: string;
  name: string;
  status: boolean;
  edit: boolean;
}

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    CardModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToggleButtonModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css',
})
export class QueueComponent {
  queueData?: Queue;
  candidates: Candidate[] = [];
  queue?: {
    topic: string;
    type: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    status: 'PENDING' | 'ONGOING' | 'COMPLETED';
    managername: string;
    startdate: string;
    starttime: string;
  };

  constructor(private managerService: ManagerService) {
    this.fetchQueueData();
  }

  fetchQueueData() {
    this.queueData = undefined;
    this.candidates = [];
    this.queue = undefined;
    this.managerService.getQueueData().subscribe((d) => {
      this.queueData = d;
      this.candidates = this.queueData.candidates.map((d) => {
        return {
          ...d,
          edit: false,
        };
      });
      this.queue = {
        topic: this.queueData.topic,
        type: this.queueData.type,
        managername: this.queueData.managername,
        status: this.queueData.status,
        startdate: this.queueData.startdate,
        starttime: this.queueData.starttime,
      };
    });
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
          this.fetchQueueData();
        },
        error: (error) => {
          alert(error.error.message)
        }
      });
    }
  }
}
