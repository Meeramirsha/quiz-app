import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: any, format:string ='short'): string {
    if(!value) return '';
    const date = new Date(value);  
    if(format === 'short'){
      const day =   String(date.getDate()).padStart(2,'0');
      const month = String(date.getMonth() + 1).padStart(2,'0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2,'0');
      const minutes = String(date.getMinutes()).padStart(2,'0');
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
    return value.toString();
  }
}