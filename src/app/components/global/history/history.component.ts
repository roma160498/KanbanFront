import { Component, OnInit, Input, Inject, Optional, Output, EventEmitter } from '@angular/core';
import { HistoryService } from '../../../services/history.service';
import { DateHelperService } from '../../../services/date-helper.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [{
    provide: MatDialogRef,
    useValue: {}
  }]
})
export class HistoryComponent implements OnInit {
  @Input() id: number;
  @Input() type: string;
  @Input() isVisible: boolean;
  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();
  public changes: any[] = [];

  constructor(private historyService: HistoryService, private dateService: DateHelperService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog) {
      debugger;
     }

  ngOnInit() {
    this.historyService.getHistory(this.data.type, this.data.id).subscribe((res) => {
      this.changes = res.map((el) => JSON.parse(el.changes));
      debugger;
    });
  }

  public getDate(date) {
    return this.dateService.getDateTimeFormat(new Date(date));
  }

  public closeDialog() {
    this.dialogClosed.emit();
  }
}
