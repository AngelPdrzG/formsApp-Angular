import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html',
  styles: [],
})
export class DynamicPageComponent {
  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favouriteGames: this.fb.array([
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],
    ]),
  });

  public newFavorite: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder) {}

  get favouriteGamesControl() {
    return this.myForm.get('favouriteGames') as FormArray;
  }

  isValidField(field: string): boolean | null {
    return (
      this.myForm.controls[field].errors && this.myForm.controls[field].touched
    );
  }

  isValidFieldInArray(formArray: FormArray, i: number) {
    return formArray.controls[i].errors && formArray.controls[i].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;

    const errors = this.myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minLength':
          return `Minimo ${errors['minLength'].requiredLength} characters`;
      }
    }

    return null;
  }

  onAddToFavorites(): void {
    if (this.newFavorite.invalid) return;
    const newGame = this.newFavorite.value;

    /* this.favouriteGamesControl.push(
      new FormControl(newGame, Validators.required)
    ); */
    this.favouriteGamesControl.push(
      this.fb.control(newGame, Validators.required)
    );

    this.newFavorite.reset();
  }

  onDeleteFavourite(i: number): void {
    this.favouriteGamesControl.removeAt(i);
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);
    (this.myForm.controls['favouriteGames'] as FormArray) = this.fb.array([]);
    this.myForm.reset();
  }
}
