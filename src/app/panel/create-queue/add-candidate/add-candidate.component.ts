import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DragDropModule } from 'primeng/dragdrop';

interface Candidate {
  candidate_id: string;
  name: string;
  edit: boolean;
}

@Component({
  selector: 'app-add-candidate',
  standalone: true,
  imports: [CardModule, CommonModule, FormsModule, DragDropModule],
  templateUrl: './add-candidate.component.html',
  styleUrl: './add-candidate.component.css',
})
export class AddCandidateComponent {
  innerWidth: number = window.innerWidth;
  startIndex: number = -1;
  @Input({ alias: 'candidates', required: true }) candidates!: Candidate[];
  // @Output('candidates') emitCandidates: EventEmitter<Candidate[]> =
  //   new EventEmitter<Candidate[]>();

  // Search Candidate
  searchedCandidates: number[] = [];
  searchinput: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
  }

  onDragStart(index: number) {
    this.startIndex = index;
    console.log(index);
  }

  onDrop(dropIndex: number) {
    const general = this.candidates[this.startIndex]; // get element
    this.candidates.splice(this.startIndex, 1); // delete from old position
    this.candidates.splice(dropIndex, 0, general); // add to new position
    // this.emitCandidates.emit(this.candidates);
  }

  removeCandidate(index: number) {
    this.candidates.splice(index, 1);
    this.searchinputchange();
    // this.emitCandidates.emit(this.candidates);
  }

  addCandidateInput() {
    this.candidates.unshift({
      candidate_id: '',
      name: '',
      edit: true,
    });
    this.searchinput = '';
    this.searchinputchange();
    // this.emitCandidates.emit(this.candidates);
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
