import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Input,Output} from '@angular/core';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.html',
})
export class QuestionComponent {
@Input() question!: Question;
@Output() answerSelected = new EventEmitter<boolean>();
selectOption(isCorrect:boolean){
  this.answerSelected.emit(isCorrect);
}
}