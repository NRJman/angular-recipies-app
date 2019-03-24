import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipes.model';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  public recipe: Recipe;
  public recipeForm: FormGroup;
  private editMode: boolean;
  private currentRecipeId: number;
  private resolverDataSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private recipesService: RecipesService) { }

  onAddIngredient() {
    const ingredientNameControl = new FormControl(null),
      ingredientAmountControl = new FormControl(1);

    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': ingredientNameControl,
        'amount': ingredientAmountControl
      })
    );
  }

  onDeleteIngredient(id: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).controls.splice(id, 1);
  }

  onSubmitForm(): void {
    (this.editMode) ? this.modifyExistingRecipe() : this.addNewRecipe();
  }

  addNewRecipe(): void {
    const recipesServiceCopy = this.recipesService,
          recipeFormCopy = this.recipeForm,
          newRecipe = new Recipe(
            recipeFormCopy.value['name'],
            recipeFormCopy.value['description'],
            recipeFormCopy.value['imageUrl'],
            recipeFormCopy.value['ingredients']
          );

    recipesServiceCopy.addNewRecipe(newRecipe);
    recipesServiceCopy.updateRecipesList.next(recipesServiceCopy.recipesList);
    this.router.navigate(['/recipe-book']);
  }

  modifyExistingRecipe(): void {
    const recipesServiceCopy = this.recipesService,
          recipeFormCopy = this.recipeForm,
          updatedRecipe = new Recipe(
            recipeFormCopy.value['name'],
            recipeFormCopy.value['description'],
            recipeFormCopy.value['imageUrl'],
            recipeFormCopy.value['ingredients']
          );

    recipesServiceCopy.modifyCertainRecipe(this.currentRecipeId, updatedRecipe);
    recipesServiceCopy.updateRecipesList.next(recipesServiceCopy.recipesList);
    this.router.navigate(['/recipe-book', this.currentRecipeId]);
  }

  ngOnInit() {
    this.resolverDataSubscription = this.route.data.subscribe((data: Data) => {
      if (data.hasOwnProperty('recipe')) {
        this.recipe = data.recipe.value;
        this.currentRecipeId = data.recipe.id;
        this.editMode = true;
      } else {
        this.editMode = false;
      }
    });

    this.recipeForm = new FormGroup({
      'name': new FormControl(),
      'imageUrl': new FormControl(),
      'description': new FormControl(),
      'ingredients': new FormArray([])
    });

    if (this.editMode) {
      this.recipeForm.patchValue({
        'name': this.recipe.recipeName,
        'imageUrl': this.recipe.recipeImgUrl,
        'description': this.recipe.recipeDescription
      });

      this.recipe.recipeIngredients.forEach((ingredient) => {
        (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
          'name': new FormControl(ingredient.name),
          'amount': new FormControl(ingredient.amount)
        }));
      });
    }
  }

  ngOnDestroy() {
    this.resolverDataSubscription.unsubscribe();
  }

}
