import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Increment } from '../../../models/increment';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { IncrementService } from '../../../services/increment.service';
import { ProductService } from '../../../services/product.service';
import { DateHelperService } from '../../../services/date-helper.service';

@Component({
  selector: 'app-edit-create-increment',
  templateUrl: './edit-create-increment.component.html',
  styleUrls: ['./edit-create-increment.component.css'],
  providers: [MessageService, DateHelperService]
})
export class EditCreateIncrementComponent implements OnInit {
  selectedIncrement: Increment;
  id: number;
  name: string = '';
  number: string = '';
  start_date: Date;
  end_date: Date;
  business_objectives: string = '';
  selectedIncrements: Increment[];
  editMode: string;
  @ViewChild('relationTable') relTableComponent: RelationshipTableComponent;

  featureCols: any;
  allRelatedCols: any;
  productList: any = {};
  product_id: any;

  @Output() updatedIncrementOut: EventEmitter<any> = new EventEmitter();
  @Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
  constructor(private incrementService: IncrementService, private messageService: MessageService,
    private productService: ProductService, private dateHelper: DateHelperService) { }
  ngOnInit() {
    this.allRelatedCols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'acc_criteria', header: 'Acception criteria' },
      { field: 'creator_name', header: 'Creator' },
      { field: 'team_name', header: 'Team' },
      { field: 'type_name', header: 'Classification' },
      { field: 'created_on', header: 'Created' },
      { field: 'modified_on', header: 'Modified' },
      { field: 'closed_on', header: 'Closed' }
    ];
    this.featureCols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'acc_criteria', header: 'Acception criteria' },
      { field: 'creator_name', header: 'Creator' },
      { field: 'team_name', header: 'Team' },
      { field: 'type_name', header: 'Classification' },
      { field: 'created_on', header: 'Created' },
      { field: 'modified_on', header: 'Modified' },
      { field: 'closed_on', header: 'Closed' }
    ];
    this.productService.getProduct({}).subscribe(items => {
      this.productList.options = items.map(el => {
        return {
          label: el.name,
          value: el.id
        }
      })
    })
  }
  toolbarActionHandler(action) {
    const increment = new Increment();
    if (action === 'save') {
      if (this._isInputDataInvalid()) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Some of required fields are empty.` });
        return;
      }
      if (this.editMode === 'add') {
        debugger;
        increment.name = this.name;
        increment.business_objectives = this.business_objectives;
        increment.start_date = this.dateHelper.getDateFormat(this.start_date);
        increment.end_date = this.dateHelper.getDateFormat(this.end_date);
        increment.product_id = this.product_id;
        increment.status_id = 1;// MOCK
        this.incrementService.insertIncrement(increment).subscribe((result) => {
          if (result) {
            this.updatedIncrementOut.emit({
              isNew: true,
              increment: increment
            });
            this.isSavedResultSuccesOut.emit(true);
            this._clearForm();
          } else {
            this.isSavedResultSuccesOut.emit(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `Increment with ${this.name} name can not be created.` });
          }
        })
      } else if (this.editMode === 'edit') {
        debugger;
        for (let key in this.selectedIncrement) {
          if (this[key] !== this.selectedIncrement[key] && key != 'id') {
            increment[key] = this[key]
          }
        }
        increment.start_date = this.dateHelper.getDateFormat(this.start_date);
        increment.end_date = this.dateHelper.getDateFormat(this.end_date);
        this.incrementService.updateIncrement(increment, this.selectedIncrement.id).subscribe((result) => {
          if (result) {
            this.updatedIncrementOut.emit({
              isNew: false,
              incrementID: this.selectedIncrement.id,
              updatedProps: increment,
              keyed_name: this.name || this.selectedIncrement.name
            });
            this.isSavedResultSuccesOut.emit(true);
            this._clearForm();
          } else {
            this.isSavedResultSuccesOut.emit(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `Increment with ${this.number} name can not be updated.` });
          }
        })
      }
      this.editMode === action;
    }

    if (action === 'add' || action === 'edit') {
      this.editMode = action;
    }
  }

  _isInputDataInvalid() {
    return this.name === '' || !this.product_id || !this.start_date || !this.end_date /*|| !this.status_id*/;
  }

  _clearForm() {
    this.name = '';
    this.business_objectives = '';
    delete this.start_date;
    delete this.end_date;
    this.number = '';
    this.product_id = '';
  }

  discard() {
    this._clearForm();
    this.isSavedResultSuccesOut.emit(true);
    this.editMode = null;
  }

  splitterMove(event) {
    console.log(event)
  }
}
