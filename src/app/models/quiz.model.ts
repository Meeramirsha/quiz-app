import{Question} from './question.model';
export class Quiz{
    title: string;
    questions: Question[];
    constructor(title: string,questions: Question[]){
        this.title=title;
        this.questions=questions;
    }
}