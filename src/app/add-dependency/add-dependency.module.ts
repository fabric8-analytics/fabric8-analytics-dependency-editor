import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';

import { FilterPipe } from './add-dependency.pipe';
import { AddDependencyComponent } from './add-dependency.component';
import { ListElementModule } from '../list-element/list-element.module';


@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    ModalModule,
    ListElementModule
],
 declarations: [
    AddDependencyComponent, FilterPipe
],
 exports: [
    AddDependencyComponent
],
 providers: []
})
export class AddDependencyModule {}