export class Question{
    text:string;
    options:{ text: string; isCorrect:boolean}[];
    constructor(text: string,options:{ text: string; isCorrect:boolean}[]){
        this.text=text;
        this.options=options;
    }
}