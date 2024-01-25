import { Component, HostListener } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { AddQueueComponent } from './add-queue/add-queue.component';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-create-queue',
  standalone: true,
  imports: [
    CardModule,
    AddCandidateComponent,
    AddQueueComponent,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './create-queue.component.html',
  styleUrl: './create-queue.component.css',
})
export class CreateQueueComponent {
  innerWidth: number = window.innerWidth;
  queue: {
    topic: string;
    type: 'INTERNAL' | 'EXTERNAL' | 'INTERVIEW';
    managername: string;
    startdate: string;
    starttime: string;
  } = {
    topic: '',
    type: 'INTERVIEW',
    managername: '',
    startdate: '',
    starttime: '',
  };

  candidates: {
    candidate_id: string;
    name: string;
    edit: boolean;
  }[] = [];

  // [
  //   {
  //     candidate_id: '0834cs211033',
  //     name: 'Deevanshu Kushwah',
  //     edit: false,
  //   },
  //   {
  //     candidate_id: '0834cs211032',
  //     name: 'Deepika Prajapat',
  //     edit: false,
  //   },
  //   {
  //     candidate_id: '0834cs211040',
  //     name: 'Gunjan Yadav',
  //     edit: false,
  //   },
  //   {
  //     candidate_id: '0834cs211031',
  //     name: 'Harsh Nagle',
  //     edit: false,
  //   },
  // ]

  queueCreateResponse?: {
    manager_url: string;
    viewer_url: string;
  };

  constructor(private managerService: ManagerService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  createQueue() {
    let data: any = {};
    let candidatesData: { name: string; candidate_id: string }[] = [];
    // Check Queue Data
    if (
      this.queue.topic &&
      this.queue.type &&
      this.queue.managername &&
      this.queue.startdate &&
      this.queue.starttime
    ) {
      data = { ...this.queue };

      for (let i = 0; i < this.candidates.length; i++) {
        const element = this.candidates[i];
        if (!element.candidate_id || !element.name)
          return alert('All candidate inputs are required!');
        candidatesData.push({
          name: element.name,
          candidate_id: element.candidate_id,
        });
      }

      if (candidatesData.length == 0)
        return alert('Minimum 1 candidates are required!');
      data.candidates = candidatesData;
      // Save Data Now
      this.managerService.createQueue(data).subscribe({
        next: (d) => {
          this.queueCreateResponse = d;
          // TODO: Delete this component queue and candidates data now
          alert('Queue created successfully!');
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
    } else {
      alert('All queue inputs are required!');
    }
  }
}
