import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrl: './project-create-dialog.component.css'
})
export class ProjectCreateDialogComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  file: File | null = null; // Variable to store file
  imgUrl = 'https://static.wikia.nocookie.net/finalfantasy/images/e/ec/Cloud_Strife_from_FFVII_Rebirth_promo_render.png'
  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    team: new FormControl('', [Validators.required]),
  });
  teams: string[] = []
  filteredTeams: Observable<string[]> = of([]);


  ngOnInit(): void {
    this.teams = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
    this.filteredTeams = this.projectForm.controls.team.valueChanges.pipe(
      startWith(''),
      map(value => this.teams.filter(t => t.toLowerCase().includes(value?.toLowerCase() || ''))),
    );
  }

  onChangeFile(event: any) {
    const file: File = event.target.files[0];
    console.log(event.target.files)
    if (file) {
      this.file = file
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
      };
      reader.readAsDataURL(this.file);
    }
  }

  onSubmit() {
    console.log(this.projectForm)
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}