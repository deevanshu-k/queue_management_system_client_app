import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Candidate } from '../queue.component';
import { ManagerService } from '../../../services/manager.service';
import * as XLSX from 'xlsx';
import { DragDropModule } from 'primeng/dragdrop';
import { Queue } from '../../../services/viewer-socket.service';

@Component({
  selector: 'app-candidate-card',
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    CommonModule,
    TooltipModule,
    DragDropModule,
  ],
  templateUrl: './candidate-card.component.html',
  styleUrl: './candidate-card.component.css',
})
export class CandidateCardComponent implements OnChanges {
  @Input({ required: true, alias: 'queuedata' }) queueData!: Queue;
  @Input({ required: true, alias: 'candidates' }) candidates: Candidate[] = [];
  @Output('fetchqueuedata') fetchQueueData: EventEmitter<void> =
    new EventEmitter<void>();
  noOfDoneCandidates: number = 0;

  innerWidth: number = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  startIndex: number = -1;

  // Add Candidates
  addCandidateData: {
    candidate_id: string;
    name: string;
  }[] = [];

  // Search Candidate
  searchedCandidates: number[] = [];
  searchinput: string = '';

  constructor(private managerService: ManagerService) {}

  ngOnChanges(): void {
    this.calculateNoOfDoneCandidates();
  }

  calculateNoOfDoneCandidates() {
    this.noOfDoneCandidates = this.candidates.filter(
      (d) => d.status == true
    ).length;
  }

  resetCandidateData(index: number) {
    if (!this.queueData?.candidates[index]) return;
    this.candidates[index].candidate_id =
      this.queueData?.candidates[index].candidate_id;
    this.candidates[index].name = this.queueData?.candidates[index].name;
  }

  // Delete Candidate
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
        this.searchinputchange();
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
            this.searchinputchange();
          },
          error: (error) => {
            alert(error.error.message);
          },
        });
    }
  }

  // Add Candidate
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
        this.fetchQueueData.emit();
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
      return this.fetchQueueData.emit();
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
          this.fetchQueueData.emit();
        },
        error: (error) => {
          alert(error.error.message);
        },
      });
  }

  searchinputchange() {
    this.searchedCandidates = [];
    if (!this.searchinput) return;
    this.candidates.forEach((c) => {
      if (
        `${c.name} ${c.candidate_id}`
          .toLowerCase()
          .includes(this.searchinput.toLowerCase())
      ) {
        this.searchedCandidates.push(this.candidates.indexOf(c));
      }
    });
  }
}
