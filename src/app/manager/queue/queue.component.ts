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

import * as XLSX from 'xlsx';

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
    TooltipModule
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css',
})
export class QueueComponent {
  innerWidth: number = window.innerWidth;
  noOfDoneCandidates: number = 0;
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

  // Add Candidates
  addCandidateData: {
    candidate_id: string;
    name: string;
  }[] = [];

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
    this.queue = undefined;
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
      this.noOfDoneCandidates = this.candidates.filter(
        (d) => d.status == true
      ).length;
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

  resetCandidateData(index: number) {
    if (!this.queueData?.candidates[index]) return;
    this.candidates[index].candidate_id =
      this.queueData?.candidates[index].candidate_id;
    this.candidates[index].name = this.queueData?.candidates[index].name;
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
          alert(error.error.message);
        },
      });
    }
  }

  saveCandidateData(index: number) {
    if (!this.queueData) return;
    if (
      this.candidates[index].candidate_id !=
        this.queueData.candidates[index].candidate_id ||
      this.candidates[index].name != this.queueData.candidates[index].name ||
      this.candidates[index].status != this.queueData.candidates[index].status
    ) {
      // Save
      let updateData: {
        candidate_id?: string;
        name?: string;
        status?: boolean;
      } = {};
      if (
        this.candidates[index].candidate_id !=
        this.queueData.candidates[index].candidate_id
      )
        updateData.candidate_id = this.candidates[index].candidate_id;
      if (this.candidates[index].name != this.queueData.candidates[index].name)
        updateData.name = this.candidates[index].name;
      if (
        this.candidates[index].status != this.queueData.candidates[index].status
      )
        updateData.status = this.candidates[index].status;

      this.managerService
        .updateCandidateData(this.candidates[index].id, updateData)
        .subscribe({
          next: (data) => {
            if (this.queueData?.candidates[index]) {
              this.queueData.candidates[index].candidate_id =
                this.candidates[index].candidate_id;
              this.queueData.candidates[index].name =
                this.candidates[index].name;
              this.queueData.candidates[index].status =
                this.candidates[index].status;
            }
            this.calculateNoOfDoneCandidates();
          },
          error: (error) => {
            alert(error.error.message);
          },
        });
    }
  }

  deleteCandidate(candidateId: string) {
    this.managerService.deleteCandidate(candidateId).subscribe({
      next: (data) => {
        if (this.queueData?.candidates) {
          this.queueData.candidates = this.queueData.candidates.filter(
            (c) => c.id != candidateId
          );
        }
        this.candidates = this.candidates.filter((c) => c.id != candidateId);
        this.calculateNoOfDoneCandidates();
      },
      error: (error) => {
        alert(error.error.message);
      },
    });
  }

  confirmDeleteCandidate(candidateId: string, candidateName: string) {
    if (confirm('Are you sure you want to delete ' + candidateName + '.')) {
      this.deleteCandidate(candidateId);
    }
  }

  calculateNoOfDoneCandidates() {
    this.noOfDoneCandidates = this.candidates.filter(
      (d) => d.status == true
    ).length;
  }

  addCandidateInput() {
    this.addCandidateData.push({
      candidate_id: '',
      name: '',
    });
  }

  removeCandidateFromCandidateInput(index: number) {
    this.addCandidateData.splice(index, 1);
  }

  addCandidatesToQueue() {
    // TODO: For Adding One Candidates

    // For Adding Full Candidates
    for (let i = 0; i < this.addCandidateData.length; i++) {
      const element = this.addCandidateData[i];
      if (!element.candidate_id || !element.name) {
        alert('Empty value not allowed!');
        return;
      }
    }
    this.managerService.addCandidates(this.addCandidateData).subscribe({
      next: (data) => {
        this.addCandidateData = [];
        this.fetchQueueData();
      },
      error: (error) => {
        alert(error.error.message);
      },
    });
  }

  // Candidate Position Change
  onDragStart(index: number) {
    this.startIndex = index;
    console.log(index);
  }

  onDrop(dropIndex: number) {
    const general = this.candidates[this.startIndex]; // get element
    this.candidates.splice(this.startIndex, 1); // delete from old position
    this.candidates.splice(dropIndex, 0, general); // add to new position
    // this.emitCandidates.emit(this.candidates);

    let updatedCandidates: { id: string; placevalue: number }[] = [];
    if (!this.queueData?.candidates) return;
    if (this.queueData.candidates.length != this.candidates.length)
      return this.fetchQueueData();
    for (let i = 0; i < this.queueData.candidates.length; i++) {
      const candidate = this.queueData.candidates[i];
      if (candidate.placevalue != this.candidates[i].placevalue) {
        updatedCandidates.push({
          id: this.candidates[i].id,
          placevalue: candidate.placevalue,
        });
      }
    }

    if (!updatedCandidates.length) return;
    this.managerService
      .updateMultipleCandidatesData(updatedCandidates)
      .subscribe({
        next: (data) => {
          // Updated Successfully!
          this.fetchQueueData();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  uploadFile(event: any) {
    if (!event.target.files[0]) return;
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event: any) => {
      let binaryData = event.target.result;
      let workbook = XLSX.read(binaryData, { type: 'binary', cellDates: true });
      workbook.SheetNames.forEach((sheet) => {
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log(data);
        data.forEach((candidate: any) => {
          if (candidate.id && candidate.name) {
            this.addCandidateData.push({
              candidate_id: String(candidate.id),
              name: String(candidate.name),
            });
          }
        });
      });
    };
  }
}
