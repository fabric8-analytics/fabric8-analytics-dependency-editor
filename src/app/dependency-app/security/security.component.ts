import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import {
  TagInputModule
} from 'ngx-chips';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import { CveResponseModel } from '../model/data.model';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})

export class SecurityComponent implements OnInit, OnChanges {
  @Input() cveData: CveResponseModel;

  public title = 'Security Alert';
  public icon = 'fa fa-shield';
  public noOfCves = 0;
  public responseReady = false;
  public hasIssue = false;

  constructor() {}

  ngOnChanges() {
    console.log(this.cveData);
    if (this.cveData) {
      this.cveData.result.forEach(item => {
        if (item.cve) {
          this.noOfCves++;
          this.hasIssue = true;
        }
      });
      this.responseReady = true;
    }
  }

  ngOnInit() {

  }

}
