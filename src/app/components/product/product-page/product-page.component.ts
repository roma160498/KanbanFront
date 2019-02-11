import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../models/product';
import { TableProductsComponent } from '../table-products/table-products.component';
import { EditCreateProductComponent } from '../edit-create-product/edit-create-product.component';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  @ViewChild('productTable') tableComponent: TableProductsComponent;
	@ViewChild('editComponent') editComponent: EditCreateProductComponent;
	isTableDisplayed: boolean = true;
	selectedProducts: Product[];
	updatedProduct: Product;
	lastToolbarAction: string;
	toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: false,
		isAddDisabled: false
	};
	editMode: boolean = false;

	userPermissions: any = {};

	constructor() {
	 }

	ngOnInit() {
		this.userPermissions = JSON.parse(localStorage.getItem('permissions'));
		this._updateToolbarButtonsDisabledStates();
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const product = this.selectedProducts[0];
      		this.editComponent.name = product.name;
      		this.editComponent.description = product.description;
			this.editComponent.selectedProduct = product;
			this.editMode = true;
		} else {
			this.editMode = false;
		}	
		this.isTableDisplayed = event === 'add' || event === 'edit' || event === 'save' ? false : true;
		this._updateToolbarButtonsDisabledStates();
		this.tableComponent.toolbarActionHandler(event, {});
		this.editComponent.toolbarActionHandler(event, );
	}

	rowsAmountChangeHandler(event) {
		this.tableComponent.rowsAmountChangeHandler(event, {});
	}

	selectedProductsOut(event) {
		this.selectedProducts = event;
		this._updateToolbarButtonsDisabledStates();
	}

	updatedProductOut(event) {
		this.updatedProduct = event;
	}

	isSavedResultSuccesOut(event) {
		this.isTableDisplayed = event;
		if (event) {
			this._updateToolbarButtonsDisabledStates();
		}
	}

	_updateToolbarButtonsDisabledStates() {
		this.toolbarButtonsDisabledOptions = {
			isDeleteDisabled: !this.userPermissions.products.get || !this.userPermissions.products.delete ||  !(this.selectedProducts && this.selectedProducts.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedProducts && this.selectedProducts.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: (!this.userPermissions.products.create && !this.userPermissions.products.update) || (!this.isTableDisplayed && this.editMode && !this.userPermissions.products.update) || this.isTableDisplayed,
			isRefreshDisabled: !this.userPermissions.products.get || !this.isTableDisplayed,
			isRowsDownDisabled: !this.userPermissions.products.get || !this.isTableDisplayed,
			isAddDisabled: !this.userPermissions.products.get || !this.userPermissions.products.create || !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
