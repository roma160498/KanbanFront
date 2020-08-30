import { Component, OnInit, Input, Inject, Optional, Output, EventEmitter, ViewChild } from '@angular/core';
import { HistoryService } from '../../../services/history.service';
import { DateHelperService } from '../../../services/date-helper.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import { MessageService } from 'primeng/components/common/messageservice';
import { ImageLoaderService } from '../../../services/image-loader.service';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'file-page',
  templateUrl: './file-page.component.html',
  styleUrls: ['./file-page.component.css'],
  providers: [MessageService]
})
export class FilePageComponent implements OnInit {
    toolbarButtonsDisabledOptions: any = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: true,
		isRowsDownDisabled: true,
		isAddDisabled: false
    };
    @ViewChild('invisibleFileInput') invisibleFileInput;
    files: any[] = [];
    selectedFile: any = {};
    items: MenuItem[];
    isLoading: boolean = true;
    isFilterVisible: boolean = true;

    constructor(private fileService: ImageLoaderService, private messageService: MessageService) {}
    
    ngOnInit() {
        this.getFiles();
        this.items = [
            {label: 'Download', icon: 'pi pi-fw pi-search', command: () => {}},
            {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => {}},
            {label: 'Add New', icon: 'pi pi-fw pi-times', command: () => {}}
        ];
    }

    getFiles() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false
        }, 500)
        this.fileService.getAllFiles().subscribe(files => {
            debugger;
            this.files = files.map(el => {
                const newName = el.path.slice(el.path.indexOf('\\uploads\\') + 9);
                return {
                    ...el,
                    type: newName.slice(newName.indexOf('.') + 1),
                    name: newName
                }
            });
        });
    }

    deleteFile(file) {
        debugger;
        this.fileService.deleteFile(file.id).subscribe(()=> {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: `Successfully deleted.` });
            this.getFiles();
        })
    }

    downloadFile(file) {
        this.fileService.downloadFile(file.id).subscribe((res)=> {
            debugger;
            var a = document.createElement("a");
            document.body.appendChild(a);
            const url= window.URL.createObjectURL(res);
            a.href = url;
            a.download = file.name;
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: `No such file on server.` });
        )
    }

    toolbarActionHandler(action) {
        debugger;
        if (action === 'add') {
            this.invisibleFileInput.nativeElement.value = null;
            this.invisibleFileInput.nativeElement.click();
        } else if (action === 'filter') {
            this.isFilterVisible = !this.isFilterVisible;
        }
    }

    onFileSelected(event) {
		const files = this.invisibleFileInput.nativeElement.files;
		if (files && files.length) {
			const imageFile = files[0];
			debugger;
			this.fileService.uploadFile(imageFile).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: `File uploaded.` });
                this.getFiles();
			});
		}
	}
}
