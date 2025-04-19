import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { FileService } from 'src/app/services/file.service';
import { switchMap, of, forkJoin, catchError, map } from 'rxjs';
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
  roles = [
    { label: 'Member', value: 'MEMBER' },
    { label: 'Moderator', value: 'Moderator' },
    { label: 'Admin', value: 'Admin' },
  ];

  userForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    role: new FormControl('', Validators.required),
  });

  constructor(
    private userService: UserService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isStandalone = true;
        this.visible = true;
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']?.currentValue) {
      this.setupEditMode();
    } else if (!this.isStandalone) {
      this.setupCreateMode();
    }
  }

  setupEditMode() {
    this.isPatch = true;
    this.userForm.patchValue(this.user!);
    this.userForm.controls.username.disable();
    this.imagePreview = this.user?.imageUrl;
    if (this.user?.id) this.loadUserTeams();
  }

  setupCreateMode() {
    this.isPatch = false;
    this.userForm.controls.password.addValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.controls.username.enable();
    this.imagePreview = undefined;
  }

  loadUser(id: number) {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.setupEditMode();
      },
      error: (error) => console.error('Error loading user:', error)
    });
  }

  loadUserTeams() {
    this.teamService.listTeams().pipe(
      switchMap(teams => {
        const teamRequests = teams.map(team => 
          this.teamService.getTeamMembers(team.id!).pipe(
            map(members => ({ ...team, members })),
            catchError(() => of({ ...team, members: [] }))
          )
        );
        return forkJoin(teamRequests).pipe(
          map(teamsWithMembers => teamsWithMembers.filter(team => 
            team.members.some(member => member.id === this.user?.id)
          ))
        );
      })
    ).subscribe({
      next: (teams) => this.userTeams = teams,
      error: (error) => {
        console.error('Error loading user teams:', error);
        this.userTeams = [];
      }
    });
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.imagePreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValues = this.userForm.getRawValue();
    const body: Partial<User> = {
      firstName: formValues.firstName || undefined,
      lastName: formValues.lastName || undefined,
      email: formValues.email || undefined,
      role: formValues.role || undefined
    };
    
    if (!this.isPatch) {
      body.username = formValues.username || undefined;
      body.password = formValues.password || undefined;
    }

    this.isSubmitted = true;
    const saveOperation = this.isPatch && this.user 
      ? this.userService.patchUser(this.user.id!, body)
      : this.userService.createUser(body);

    saveOperation.pipe(
      switchMap((user) => this.handleImageUpload(user as User)),
        catchError(error => {
        console.error('Error saving user:', error);
        this.isSubmitted = false;
        return of(null);
      })
    ).subscribe(user => {
      if (user && 'id' in user) this.handleSuccess(user as User);
    });
  }

  handleImageUpload(user: User) {
    if (this.coverFile && user?.id) {
      const filepath = `/users/${user.id}/`;
      return this.fileService.upload(this.coverFile, filepath, 'avatar.png').pipe(
        switchMap(fileResponse => {
          if ('url' in fileResponse && fileResponse.url) {
            return this.userService.patchUser(user.id!, { imageUrl: fileResponse.url });
          }
          return of(user);
        }),
        catchError(() => of(user))
      );
    }
    return of(user);
  }

  handleSuccess(user: User) {
    if (this.isStandalone) {
      this.router.navigate(['/users', this.isPatch ? user.id : '']);
    } else {
      this.closeEvent.emit(user);
      this.visible = false;
      this.visibleChange.emit(false);
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
    if (!this.isSubmitted && !this.isStandalone) {
      this.closeEvent.emit(null);
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
