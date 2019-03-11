import { Component, OnInit, ViewChild, Output, EventEmitter, ViewContainerRef, Input } from '@angular/core';
import { Increment } from '../../../models/increment';
import { RelationshipTableComponent } from '../../global/relationship-table/relationship-table.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { IncrementService } from '../../../services/increment.service';
import { ProductService } from '../../../services/product.service';
import { DateHelperService } from '../../../services/date-helper.service';
import { ComponentLoaderService } from '../../../services/component-loader.service';
import { EditCreateIterationComponent } from '../../iteration/edit-create-iteration/edit-create-iteration.component';
import { FeatureService } from '../../../services/feature.service';

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
  @ViewChild('newIterationForm', { read: ViewContainerRef }) entry: ViewContainerRef;
  @Input() relationshipPermissions: any;
  
  iterationCols: any;
  featuresCols: any;
  allRelatedCols: any;
  productList: any = {};
  product_id: any;
  statusList: any = {};
  status_id: any = null;
  isIterationFormVisible: Boolean = false;
  iterationFormComponent: any;

  @Output() updatedIncrementOut: EventEmitter<any> = new EventEmitter();
  @Output() isSavedResultSuccesOut: EventEmitter<boolean> = new EventEmitter();
  constructor(private incrementService: IncrementService, private messageService: MessageService,
    private productService: ProductService, private dateHelper: DateHelperService,
    private componentLoaderService: ComponentLoaderService, private featureService: FeatureService) { }
  ngOnInit() {
    debugger;
    // this.allRelatedCols = [
		// 	{ field: 'number', header: 'Iteration number' },
		// 	{ field: 'name', header: 'Iteration name' },
		// 	{ field: 'start_date', header: 'Started On' },
		// 	{ field: 'end_date', header: 'Ended On' },
		// 	{ field: 'story_points', header: 'Story points' },
		// 	{ field: 'status_name', header: 'Status' }
    // ];
    this.iterationCols = [
			{ field: 'number', header: 'Iteration number' },
			{ field: 'name', header: 'Iteration name' },
			{ field: 'start_date', header: 'Started On' },
			{ field: 'end_date', header: 'Ended On' },
			{ field: 'story_points', header: 'Story points' },
			{ field: 'status_name', header: 'Status' }
    ];
    this.allRelatedCols = this.featuresCols = [
      { field: 'number', header: 'Feature Number' },
			{ field: 'name', header: 'Name' },
			{ field: 'creator_name', header: 'Creator' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'type_name', header: 'Classification' },
			{ field: 'status_name', header: 'Status' },
			{ field: 'product_name', header: 'Product' },
			{ field: 'isClosed', header: 'Closed' }
    ];
    this.productService.getProduct({}).subscribe(items => {
      this.productList.options = items.map(el => {
        return {
          label: el.name,
          value: el.id
        }
      })
    });
    this.incrementService.getIncrementStates().subscribe(items => {
			this.statusList.list = items;
			this.statusList.options = items.map(el => {
				return {
					label: el.name,
					value: el.id
				}
			});
			this.status_id = 1; // future state
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
        increment.status_id = this.status_id;
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
    this.status_id = 1;
    this.selectedIncrement = null;
  }

  discard() {
    this._clearForm();
    this.isSavedResultSuccesOut.emit(true);
    this.editMode = null;
  }

  splitterMove(event) {
    console.log(event)
  }

  createNewIteration() {
    this.isIterationFormVisible = true;
    this.componentLoaderService.setRootViewContainerRef(this.entry);
    this.iterationFormComponent = this.componentLoaderService.addComponent(EditCreateIterationComponent);
    this.iterationFormComponent.instance.increment_id = this.selectedIncrement.id;
    this.iterationFormComponent.instance.isCalendarDisabled = false;
    this.iterationFormComponent.instance.isPopupMode = true;
    this.iterationFormComponent.instance.minDate = new Date(this.selectedIncrement.start_date);
    this.iterationFormComponent.instance.maxDate = new Date(this.selectedIncrement.end_date);
    this.iterationFormComponent.instance.completeness = 0;
    this.iterationFormComponent.instance.story_points = 0;
    this.iterationFormComponent.instance.popupComponent = this.iterationFormComponent;
    this.iterationFormComponent.instance.isSavedResultSuccesOutInPopupMode.subscribe((() => {
      this.isIterationFormVisible = false;
    }).bind(this));
  }

  onHideIterationForm() {
    this.iterationFormComponent.destroy();
  }
}
