import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from './../hero.service';

@Component({
  selector: 'toh-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private _searchTerms = new Subject<string>();

  constructor(private _heroService: HeroService) { }

  // Push a search term into the observable steram
  search(term: string): void {
    this._searchTerms.next(term);
  }

  ngOnInit() {
    this.heroes$ = this._searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if  same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this._heroService.searchHeroes(term))
    );
  }

}
