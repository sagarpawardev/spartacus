import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRoot from '../../routing/store';
import * as fromStore from '../store';
import { AuthenticationTokenInterceptor } from './authentication-token.interceptor';
import {
  ClientAuthenticationToken,
  UserToken
} from '../../user/models/token-types.model';
import { ConfigService } from '../../occ/config.service';

class MockConfigService {
  server = {
    baseUrl: 'https://localhost:9002',
    occPrefix: '/rest/v2/'
  };

  site = {
    baseSite: 'electronics',
    language: '',
    currency: ''
  };
}

describe('AuthenticationTokenInterceptor', () => {
  const testToken: ClientAuthenticationToken = {
    access_token: 'abc-123',
    token_type: 'bearer',
    expires_in: 1000,
    scope: ''
  };
  const userToken: UserToken = {
    access_token: 'xxx',
    token_type: 'bearer',
    refresh_token: 'xxx',
    expires_in: 1000,
    scope: ['xxx'],
    userId: 'xxx'
  };
  let httpMock: HttpTestingController;
  let store: Store<fromStore.ClientAuthenticationState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          auth: combineReducers(fromStore.reducers)
        })
      ],
      providers: [
        { provide: ConfigService, useClass: MockConfigService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationTokenInterceptor,
          multi: true
        }
      ]
    });
    store = TestBed.get(Store);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('Client Token', () => {
    it('Should only add token to specified requests', inject(
      [HttpClient],
      (http: HttpClient) => {
        spyOn(store, 'select').and.returnValue(of(testToken));
        http.get('/test').subscribe(result => {
          expect(result).toBeTruthy();
        });
        let mockReq = httpMock.expectOne('/test');
        let authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBe(null);

        http
          .post('/somestore/forgottenpasswordtokens', { userId: 1 })
          .subscribe(result => {
            expect(result).toBeTruthy();
          });
        mockReq = httpMock.expectOne('/somestore/forgottenpasswordtokens');
        authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBe(
          `${testToken.token_type} ${testToken.access_token}`
        );
      }
    ));

    it('Should fetch client token if the store is empty', inject(
      [HttpClient],
      (http: HttpClient) => {
        spyOn(store, 'select').and.returnValue(of({}));
        spyOn(store, 'dispatch').and.stub();
        http.get('somestore/users').subscribe(result => {
          expect(result).toBeTruthy();
        });

        expect(store.dispatch).toHaveBeenCalledWith(
          new fromStore.LoadClientAuthenticationToken()
        );
      }
    ));
  });

  describe('User Token', () => {
    beforeEach(() => {
      spyOn(store, 'select').and.returnValue(of(userToken));
    });

    it(`Should not add 'Authorization' header with a token info to an HTTP request`, inject(
      [HttpClient],
      (http: HttpClient) => {
        http.get('/xxx').subscribe(result => {
          expect(result).toBeTruthy();
        });

        const mockReq = httpMock.expectOne(req => {
          return req.method === 'GET';
        });

        const authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBeFalsy();
        expect(authHeader).toEqual(null);

        mockReq.flush('someData');
      }
    ));

    it(`Should add 'Authorization' header with a token info to an HTTP request`, inject(
      [HttpClient],
      (http: HttpClient) => {
        http
          .get('https://localhost:9002/rest/v2/electronics')
          .subscribe(result => {
            expect(result).toBeTruthy();
          });

        const mockReq = httpMock.expectOne(req => {
          return req.method === 'GET';
        });

        const authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBeTruthy();
        expect(authHeader).toEqual(
          `${userToken.token_type} ${userToken.access_token}`
        );

        mockReq.flush('someData');
      }
    ));
  });
});
