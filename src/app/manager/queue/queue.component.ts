import { Component, HostListener } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager.service';
import { Queue } from '../../services/viewer-socket.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DragDropModule } from 'primeng/dragdrop';

import { QueueCardComponent } from './queue-card/queue-card.component';
import { CandidateCardComponent } from './candidate-card/candidate-card.component';

export interface Candidate {
  id: string;
  candidate_id: string;
  name: string;
  status: boolean;
  edit: boolean;
  placevalue: number;
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
    DragDropModule,
    TooltipModule,
    QueueCardComponent,
    CandidateCardComponent,
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css',
})
export class QueueComponent {
  innerWidth: number = window.innerWidth;
  queueData?: Queue;
  candidates: Candidate[] = [];

  // Move Candidate
  startIndex: number = -1;

  constructor(private managerService: ManagerService) {
    this.fetchQueueData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  fetchQueueData() {
    this.queueData = undefined;
    this.candidates = [];
    this.managerService.getQueueData().subscribe((d) => {
      this.queueData = {
        ...d,
        candidates: d.candidates.sort((a, b) => a.placevalue - b.placevalue),
      };
      this.candidates = this.queueData.candidates.map((d) => {
        return {
          ...d,
          edit: false,
        };
      });
    });
  }
}
