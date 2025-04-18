import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { FileService } from 'src/app/services/file.service';
import { switchMap, of, forkJoin, catchError, throwError, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-user-detail-manage',
  templateUrl: './user-detail-manage.component.html',
})
export class UserDetailManageComponent implements OnChanges, OnInit {
  @Input() user?: User;
  @Output() userChange = new EventEmitter<User>();
  @Output() closeEvent = new EventEmitter<User | null>();
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  userTeams: Team[] = [];

  isPatch = false;
  isSubmitted = false;
  imagePreview?: string;
  coverFile?: File;
  userId?: number;
  isStandalone = false;

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    role: new FormControl('', Validators.required),
  });

  roles = [
    { label: 'Member', value: 'MEMBER' },
    { label: 'Moderator', value: 'Moderator' },
    { label: 'Admin', value: 'Admin' },
  ];

  constructor(
    private userService: UserService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    // Check if we're in standalone mode (accessed via route)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isStandalone = true;
        this.visible = true; // Make the dialog visible
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: number) {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isPatch = true;
        this.userForm.patchValue(user);
        this.userForm.controls.username.disable();
        this.imagePreview = user.imageUrl;
        
        this.loadUserTeams();
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

  loadUserTeams() {
    if (this.user?.id) {
      this.teamService.listTeams().pipe(
        switchMap(teams => {
          const teamRequests = teams.map(team => 
            this.teamService.getTeamMembers(team.id!).pipe(
              map(members => ({ ...team, members })),
              catchError(() => of({ ...team, members: [] }))
            )
          );
          
          return forkJoin(teamRequests).pipe(
            map(teamsWithMembers => {
              return teamsWithMembers.filter(team => 
                team.members.some(member => member.id === this.user?.id)
              );
            })
          );
        })
      ).subscribe({
        next: (teams) => {
          this.userTeams = teams;
        },
        error: (error) => {
          console.error('Error loading user teams:', error);
          this.userTeams = [];
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']?.currentValue) {
      this.isPatch = true;
      this.userForm.patchValue(changes['user'].currentValue);
      this.userForm.controls.username.disable();
      this.imagePreview = this.user?.imageUrl;
    } else if (!this.isStandalone) {
      this.isPatch = false;
      this.userForm.controls.password.addValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.controls.username.enable();
      this.imagePreview = undefined;
    }
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.imagePreview = event.target?.result as string;
      };
    }
  }

  onSave() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Get form values, ensuring we only send valid fields to the API
    const body: Partial<User> = {};
    
    // Only include fields that have values
    const formValues = this.userForm.getRawValue();
    if (formValues.firstName) body.firstName = formValues.firstName;
    if (formValues.lastName) body.lastName = formValues.lastName;
    if (formValues.email) body.email = formValues.email;
    if (formValues.role) body.role = formValues.role;
    
    // For new users, include username and password
    if (!this.isPatch) {
      if (formValues.username) body.username = formValues.username;
      if (formValues.password) body.password = formValues.password;
    }

    console.log('Saving user with data:', body); // Debug what's being sent

    this.isSubmitted = true;

    if (this.isPatch && this.user) {
      this.userService.patchUser(this.user.id!, body)
        .pipe(
          catchError(error => {
            console.error('Error updating user:', error);
            this.isSubmitted = false;
            // You might want to show an error message to the user here
            return throwError(() => error);
          }),
          switchMap(response => {
            if (this.coverFile && this.user?.id) {
              const filepath = `/users/${this.user.id}/`;
              const filename = 'avatar.png';
              return this.fileService.upload(this.coverFile, filepath, filename)
                .pipe(
                  catchError(error => {
                    console.error('Error uploading image:', error);
                    // Return the user without image update
                    return of(response);
                  }),
                  switchMap(fileResponse => {
                    if ('url' in fileResponse && fileResponse.url) {
                      return this.userService.patchUser(this.user!.id!, { imageUrl: fileResponse.url })
                        .pipe(
                          catchError(error => {
                            console.error('Error updating user image URL:', error);
                            return of(response);
                          })
                        );
                    }
                    return of(response);
                  })
                );
            }
            return of(response);
          })
        )
        .subscribe({
          next: (updatedUser) => {
            console.log('User updated successfully:', updatedUser);
            
            // Create a complete user object with updated values
            const finalUser = {
              ...this.user,
              ...body,
              imageUrl: this.imagePreview || this.user?.imageUrl
            } as User;

            if (this.isStandalone) {
              this.router.navigate(['/users', this.user?.id]);
            } else {
              this.closeEvent.emit(finalUser);
              this.visibleChange.emit(false);
              this.visible = false; // Ensure dialog closes
            }
          },
          error: () => {
            this.isSubmitted = false;
            // Error already logged in the catchError operator
          }
        });
    } else {
      body.password = this.userForm.value.password || undefined;
      this.userService.createUser(body)
        .pipe(
          switchMap(newUser => {
            if (this.coverFile && newUser?.id) {
              const filepath = `/users/${newUser.id}/`;
              const filename = 'avatar.png';
              return this.fileService.upload(this.coverFile, filepath, filename)
                .pipe(
                  switchMap(fileResponse => {
                    return this.userService.patchUser(newUser.id!, { imageUrl: fileResponse.url });
                  })
                );
            }
            return of(newUser);
          })
        )
        .subscribe({
          next: (v) => {
            if (this.isStandalone) {
              this.router.navigate(['/users']);
            } else {
              this.closeEvent.emit(v as User);
              this.visible = false;
            }
          }
        });
    }
  }

  onCancel() {
    if (this.isStandalone) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.visible = false;
    }
  }

  onHide() {
    if (!this.isSubmitted) {
      if (!this.isStandalone) {
        this.closeEvent.emit(null);
      }
    }

    if (!this.isStandalone) {
      this.visible = false;
      this.isSubmitted = false;
      this.userForm.reset();
      this.imagePreview = undefined;
    }
  }

  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get role() { return this.userForm.get('role'); }
  get email() { return this.userForm.get('email'); }
}
