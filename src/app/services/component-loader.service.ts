import { Injectable, Inject, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { KanbanBoardComponent } from '../components/kanban-board/kanban-board.component';
import { TableTeamsComponent } from '../components/table-teams/table-teams.component';
import { ItemsToolbarComponent } from '../components/items-toolbar/items-toolbar.component';

@Injectable()
export class ComponentLoaderService {
  rootViewContainer: ViewContainerRef;
  factoryResolver: any;

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver
  }
  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addComponent(componentName) {
    this.rootViewContainer.clear();
    const factory = this.factoryResolver.resolveComponentFactory(componentName)
    const componentInstance = factory.create(this.rootViewContainer.parentInjector)
    this.rootViewContainer.insert(componentInstance.hostView);
    return componentInstance;
  }
}
