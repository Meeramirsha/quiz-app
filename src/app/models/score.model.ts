export class Score{
    private correctAnswers=0;
    incrementCorrect():void{
        this.correctAnswers++;
    }
    getScore(): number{
        return this.correctAnswers;
    }
}