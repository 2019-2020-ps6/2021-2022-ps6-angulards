import { HttpHeaders } from '@angular/common/http';

export const httpOptionsBase = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export const httpOptionsFormData = {
  headers: new HttpHeaders({
   'Content-Type': 'multipart/form-data'
  })
};

export const serverUrl = 'http://localhost:9428/api';
