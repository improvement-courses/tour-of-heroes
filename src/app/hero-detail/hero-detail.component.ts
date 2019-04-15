import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from './../hero.service';

@Component({
  selector: 'toh-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;

  constructor(
    private _route: ActivatedRoute,
    private _heroService: HeroService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this._route.snapshot.paramMap.get('id');
    this._heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this._location.back();
  }

  save(): void {
    this._heroService.updateHero(this.hero)
      .subscribe(() => this.goBack);
  }

}
