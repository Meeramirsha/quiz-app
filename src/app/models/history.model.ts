export class History{
    quizTitle:string;
    score: number;
    date:Date;
    maxScore:number;
    constructor( quizTitle:string,score: number,date:Date,maxScore:number){
        this.quizTitle=quizTitle;
        this.score=score;
        this.date=date;
        this.maxScore=maxScore;
    }
}