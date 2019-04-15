import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private _heroesUrl = 'api/heroes'; // URL to web api

  constructor(
    private _http: HttpClient,
    private _messageService: MessageService
  ) { }

  /**
   * GET heroes from the server.
   */
  getHeroes(): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._heroesUrl)
    .pipe(
      tap(_ => this._log('fetched heroes')),
      catchError(this._handlerError('getHeroes', []))
    );
  }

  /**
   * GET hero by id. Will 404 if is not found
   * @param id - id of hero
   */
  getHero(id: number): Observable<Hero> {
    const url = `${ this._heroesUrl }/${ id }`;
    return this._http.get<Hero>(url)
    .pipe(
      tap(_ => this._log('fetched heroes')),
      catchError(this._handlerError<Hero>(`getHero id=${ id }`))
    );
  }

  /**
   * GET: heroes whose name contains search term
   * @param term - search
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empt hero array.
      return of([]);
    }
    return this._http.get<Hero[]>(`${this._heroesUrl}/?name=${term}`).pipe(
      tap(_ => this._log(`found heroes matching "${term}"`)),
      catchError(this._handlerError<Hero[]>())
    );
  }

  /**
   * POST: add a new hero to the server.
   * @param hero - Hero to add.
   */
  addHero(hero: Hero): Observable<Hero> {
    return this._http.post<Hero>(this._heroesUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this._log(`added hero w/ id${ newHero.id }`)),
      catchError(this._handlerError<Hero>('addHero'))
    );
  }

  /**
   * DELETE: delete the hero from the server
   * @param hero - hero to delete
   */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id  = typeof hero === 'number' ? hero : hero.id;
    const url = `${ this._heroesUrl }/${ id }`;

    return this._http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this._log(`deleted hero id=${ id }`)),
      catchError(this._handlerError<Hero>('deleteHero'))
    );
  }

  /**
   * PUT: update the hero on the server
   * @param hero - hero from update
   */
  updateHero(hero: Hero): Observable<any> {
    return this._http.put(this._heroesUrl, hero, httpOptions).pipe(
      tap(_ => this._log(`updated hero id=${ hero.id }`)),
      catchError(this._handlerError<any>('updateHero'))
    );
  }

  /**
   * Handle http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed.
   * @param result - optional value to return as the observable result.
   */
  private _handlerError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this._log(`${ operation } failed: ${ error.message }`);

      // TODO: Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
  * Log a HeroService message with the MessageService.
  * @param message: string
  */
  private _log(message: string): void {
    this._messageService.add(`HeroService: ${ message }`);
  }

}
