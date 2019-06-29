import { NgModule } from '@angular/core';
import { EventsPipeFunction } from './event.pipe';

const CUSTOM_PIPES = [
  EventsPipeFunction
];

@NgModule({
  imports: [],
  declarations: [
    CUSTOM_PIPES
  ],
  exports: [
    CUSTOM_PIPES
  ]
})
export class CustomPipesModule {}
