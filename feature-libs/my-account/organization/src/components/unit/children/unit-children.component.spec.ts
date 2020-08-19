import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import {
  I18nTestingModule,
  RoutingService,
  OrgUnitService,
  RoutesConfig,
  RoutingConfig,
  B2BUnitNode,
} from '@spartacus/core';

import { UnitChildrenComponent } from './unit-children.component';
import createSpy = jasmine.createSpy;
import { defaultStorefrontRoutesConfig } from 'projects/storefrontlib/src/cms-structure/routing/default-routing-config';
import { Table2Module } from '@spartacus/storefront';

const code = 'b1';

const mockedTree: B2BUnitNode = {
  active: true,
  children: [
    {
      active: true,
      children: [],
      id: 'Rustic Services',
      name: 'Rustic Services',
      parent: 'Rustic',
    },
    {
      active: true,
      children: [],
      id: 'Rustic Retail',
      name: 'Rustic Retail',
      parent: 'Rustic',
    },
  ],
  id: code,
  name: 'orgUnit1',
};

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

class MockOrgUnitService implements Partial<OrgUnitService> {
  load = createSpy('load');
  getChildUnits = createSpy('getChildUnits').and.returnValue(
    of(mockedTree.children)
  );
  loadTree = createSpy('loadTree');
}

const mockRouterState = {
  state: {
    params: {
      code,
    },
  },
};

class MockRoutingService {
  go = createSpy('go').and.stub();
  getRouterState = createSpy('getRouterState').and.returnValue(
    of(mockRouterState)
  );
}

const mockRoutesConfig: RoutesConfig = defaultStorefrontRoutesConfig;
class MockRoutingConfig {
  getRouteConfig(routeName: string) {
    return mockRoutesConfig[routeName];
  }
}

describe('UnitChildrenComponent', () => {
  let component: UnitChildrenComponent;
  let fixture: ComponentFixture<UnitChildrenComponent>;
  // let orgUnitsService: MockOrgUnitService;
  // let routingService: RoutingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, Table2Module, I18nTestingModule],
      declarations: [UnitChildrenComponent, MockUrlPipe],
      providers: [
        { provide: RoutingConfig, useClass: MockRoutingConfig },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: OrgUnitService, useClass: MockOrgUnitService },
      ],
    }).compileComponents();

    // orgUnitsService = TestBed.get(OrgUnitService as Type<OrgUnitService>);
    // routingService = TestBed.get(RoutingService as Type<RoutingService>);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});