import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserModule } from '@angular/platform-browser';

import { CurrentprojectComponent } from './currentproject.component';


@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    TagInputModule,
    BrowserModule
],
 declarations: [
    CurrentprojectComponent
],
 exports: [
    CurrentprojectComponent,
    
],
 providers: [],
})
export class CurrentprojectModule { }
