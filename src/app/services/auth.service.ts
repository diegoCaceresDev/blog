// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, throwError } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';

// interface TokenResponse {
//   token: string;
// }

// interface ValidationResponse {
//   valid: boolean;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/auth';
//   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
//   isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

//   constructor(private http: HttpClient) {
//     const token = localStorage.getItem('token');
//     this.checkToken(token);
//   }

//   validateToken(token: string): Observable<ValidationResponse> {
//     return this.http
//       .post<ValidationResponse>(`${this.apiUrl}/validate-token`, { token })
//       .pipe(
//         tap((response) => {
//           console.log('Token validation:', response.valid);
//           this.isAuthenticatedSubject.next(response.valid);
//         }),
//         catchError((error) => {
//           console.error('Token validation error:', error);
//           this.isAuthenticatedSubject.next(false);
//           return throwError(error);
//         })
//       );
//   }

//   updateAuthenticationStatus(isAuthenticated: boolean): void {
//     this.isAuthenticatedSubject.next(isAuthenticated);
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     this.isAuthenticatedSubject.next(false);
//   }
//   private checkToken(token: string | null): void {
//     console.log('Checking token:', token);
//     if (token) {
//       this.validateToken(token).subscribe();
//     } else {
//       this.isAuthenticatedSubject.next(false);
//     }
//   }
// }
