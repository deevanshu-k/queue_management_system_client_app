import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import {
  Candidate,
  Queue,
  ViewerSocketService,
} from '../services/viewer-socket.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Convert24to12Pipe } from '../pipes/convert24to12.pipe';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [
    ToolbarModule,
    CardModule,
    ToastModule,
    CommonModule,
    ProgressSpinnerModule,
    Convert24to12Pipe,
  ],
  providers: [MessageService],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.css',
})
export class ViewerComponent implements OnInit {
  queueId: string = '';
  queueData?: Queue;
  errorCode?: number;

  nextCandidates: {
    index: number;
    name: string;
    candidate_id: string;
  }[] = [];
  constructor(
    private route: ActivatedRoute,
    private viewSocketService: ViewerSocketService,
    private messageService: MessageService
  ) {}

  updateNextCandidates() {
    console.log(this.nextCandidates);

    this.nextCandidates = [];
    if (this.queueData?.candidates && this.queueData.status === 'ONGOING') {
      for (let i = 0; i < this.queueData?.candidates.length; i++) {
        const element = this.queueData?.candidates[i];
        if (this.nextCandidates.length >= 3) break;
        if (element.status == false)
          this.nextCandidates.push({
            index: i,
            name: element.name,
            candidate_id: element.candidate_id,
          });
      }
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((d: any) => {
      this.queueId = d.queueId;
    });

    this.viewSocketService.connectionSuccess().subscribe((data) => {
      this.viewSocketService.joinQueue(this.queueId);
    });

    this.viewSocketService.getMessages().subscribe((data) => {
      console.log(data);
      if (data.code) this.errorCode = data.code;
      this.messageService.add({
        severity: data.error ? 'info' : 'success',
        summary: data.error ? 'Info' : 'Success',
        detail: data.error ? data.error : data.success,
      });
    });

    this.viewSocketService.getQueueFullData().subscribe((data) => {
      console.log(data);

      this.queueData = {
        ...data,
        candidates: data.candidates.sort((a, b) => a.placevalue - b.placevalue),
      };

      this.updateNextCandidates();
    });

    this.viewSocketService.getQueueUpdate().subscribe((data) => {
      console.log(data);
      if (data.queue && this.queueData) {
        this.queueData.topic = data.queue.topic
          ? data.queue.topic
          : this.queueData.topic;
        this.queueData.type = data.queue.type
          ? data.queue.type
          : this.queueData.type;
        this.queueData.managername = data.queue.managername
          ? data.queue.managername
          : this.queueData.managername;
        this.queueData.status = data.queue.status
          ? data.queue.status
          : this.queueData.status;
        this.queueData.startdate = data.queue.startdate
          ? data.queue.startdate
          : this.queueData.startdate;
        this.queueData.starttime = data.queue.starttime
          ? data.queue.starttime
          : this.queueData.starttime;
      }
      if (data.candidate && this.queueData) {
        let index = this.queueData.candidates.findIndex(
          (candidate) => candidate.id == data.candidate.id
        );
        if (index >= -1) {
          this.queueData.candidates[index].candidate_id = data.candidate
            .candidate_id
            ? data.candidate.candidate_id
            : this.queueData.candidates[index].candidate_id;
          this.queueData.candidates[index].name = data.candidate.name
            ? data.candidate.name
            : this.queueData.candidates[index].name;
          this.queueData.candidates[index].status = data.candidate.status
            ? data.candidate.status
            : this.queueData.candidates[index].status;
        }
      }

      let totalCheckedCandidate = this.queueData?.candidates.filter(
        (d) => d.status == true
      )?.length;
      if (
        data.count[0] != totalCheckedCandidate ||
        data.count[1] != this.queueData?.candidates.length
      ) {
        console.log('Trigger');
        console.log(
          totalCheckedCandidate,
          data.count,
          this.queueData?.candidates.length
        );

        this.viewSocketService.needQueueFullData(this.queueId);
      }
      this.updateNextCandidates();
    });
  }
}
