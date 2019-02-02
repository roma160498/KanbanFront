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

	constructor() {
	 }

	ngOnInit() {
	}

	toolbarActionHandler(event) {
		if (event === 'edit') {
			const product = this.selectedProducts[0];
      this.editComponent.name = product.name;
      this.editComponent.description = product.description;
			this.editComponent.selectedProduct = product;
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
			isDeleteDisabled: !(this.selectedProducts && this.selectedProducts.length > 0) || !this.isTableDisplayed,
			isEditDisabled: !(this.selectedProducts && this.selectedProducts.length == 1) || !this.isTableDisplayed,
			isSaveDisabled: this.isTableDisplayed,
			isRefreshDisabled: !this.isTableDisplayed,
			isRowsDownDisabled: !this.isTableDisplayed,
			isAddDisabled: !this.isTableDisplayed,
			isFilterDisabled: !this.isTableDisplayed
		}
	}
}
