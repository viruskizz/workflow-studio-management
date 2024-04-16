import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const components: any[] = [
  
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
