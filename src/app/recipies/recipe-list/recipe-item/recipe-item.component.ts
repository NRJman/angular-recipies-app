import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../../recipies.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipeData: Recipe;
  @Output() selectRecipe = new EventEmitter();

  constructor() { }

  onRecipeSelect(): void {
    this.selectRecipe.emit();
  }

  ngOnInit() {
  }

}