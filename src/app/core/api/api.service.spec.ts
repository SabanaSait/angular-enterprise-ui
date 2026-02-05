import { TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpParams, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { API_INTERCEPTOR_OPTIONS, ApiHttpOptions } from './api.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
    TestBed.resetTestingModule();
  });

  describe('get', () => {
    it('should call http.get with correct URL and default options', () => {
      const url = '/test';
      const expectedResponse = { data: 'test' };

      service.get(url).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'GET');
      expect(req.request.method).toBe('GET');
      req.flush(expectedResponse);
    });

    it('should call http.get with options', () => {
      const url = '/test';
      const options: ApiHttpOptions = {
        headers: new HttpHeaders().set('Authorization', 'Bearer token'),
        params: new HttpParams().set('id', '1'),
        withCredentials: true,
        interceptorOptions: { retry: true },
      };
      const expectedResponse = { data: 'test' };

      service.get(url, options).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'GET');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token');
      expect(req.request.params.get('id')).toBe('1');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.context.get(API_INTERCEPTOR_OPTIONS)).toEqual({ retry: true });
      req.flush(expectedResponse);
    });
  });

  describe('post', () => {
    it('should call http.post with correct URL, body, and default options', () => {
      const url = '/test';
      const body = { name: 'test' };
      const expectedResponse = { id: 1 };

      service.post(url, body).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'POST');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush(expectedResponse);
    });

    it('should call http.post with options', () => {
      const url = '/test';
      const body = { name: 'test' };
      const options: ApiHttpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        interceptorOptions: { retry: true },
      };
      const expectedResponse = { id: 1 };

      service.post(url, body, options).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'POST');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.context.get(API_INTERCEPTOR_OPTIONS)).toEqual({ retry: true });
      req.flush(expectedResponse);
    });
  });

  describe('put', () => {
    it('should call http.put with correct URL, body, and options', () => {
      const url = '/test/1';
      const body = { name: 'updated' };
      const options: ApiHttpOptions = { params: new HttpParams().set('version', '2') };
      const expectedResponse = { success: true };

      service.put(url, body, options).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'PUT');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      expect(req.request.params.get('version')).toBe('2');
      req.flush(expectedResponse);
    });
  });

  describe('delete', () => {
    it('should call http.delete with correct URL and options', () => {
      const url = '/test/1';
      const options: ApiHttpOptions = { withCredentials: false };
      const expectedResponse = { deleted: true };

      service.delete(url, options).subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'DELETE');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(false);
      req.flush(expectedResponse);
    });
  });

  describe('context building', () => {
    it('should set interceptor options in context when provided', () => {
      const url = '/test';
      const options: ApiHttpOptions = { interceptorOptions: { retry: true } };

      service.get(url, options).subscribe();

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'GET');
      expect(req.request.context.get(API_INTERCEPTOR_OPTIONS)).toEqual({ retry: true });
      req.flush({});
    });

    it('should set default context when no interceptor options provided', () => {
      const url = '/test';

      service.get(url).subscribe();

      const req = httpMock.expectOne((req) => req.url === url && req.method === 'GET');
      expect(req.request.context.get(API_INTERCEPTOR_OPTIONS)).toEqual({
        retry: true,
        retryCount: 2,
        retryDelay: 500,
      });
      req.flush({});
    });
  });
});
