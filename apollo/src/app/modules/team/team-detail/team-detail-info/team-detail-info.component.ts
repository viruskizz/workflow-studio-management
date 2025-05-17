import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { Team } from 'src/app/models/team.model';
import { FileService } from 'src/app/services/file.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-detail-info',
  templateUrl: './team-detail-info.component.html',
})
export class TeamDetailInfoComponent implements  OnChanges {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input({ required: true }) teamId!: number;

  team: Team = {} as Team; // Initialize with empty object to prevent undefined errors
  teamForm!: FormGroup;
  isSubmitted = false;
  loading = false;
  imagePreview?: string;
  coverFile?: File;

  @Output() loadingChange = new EventEmitter<boolean>();
  @Output() imagePreviewChange = new EventEmitter<string>();
  @Output() coverFileChange = new EventEmitter<File>();

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private fb: FormBuilder,
    private fileService: FileService,
    private messageService: MessageService
  ) {
    this.teamForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teamId'] && changes['teamId'].currentValue) {
      this.teamId = changes['teamId'].currentValue;
      this.loadTeamDetails();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      leader: [null, [Validators.required]]
    });
  }

  loadTeamDetails() {
    this.loading = true;
    this.teamService
      .getTeamWithMembers(this.teamId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (team) => {
          this.team = team;
          this.updateForm(team);
        },
        error: (error) => {
          console.error('Error loading team details:', error);
          this.showMessage('error', 'Error', 'Failed to load team details');
        },
      });
  }

  private updateForm(team: Team): void {
    const { name, leader } = team;
    this.teamForm.patchValue({ name, leader });
  }

  onSave() {
    this.isSubmitted = true;
    if (this.teamForm.invalid) {
      return;
    }

    const formValue = this.teamForm.value;
    const teamData = {
      name: formValue.name,
      leaderId: formValue.leader?.id
    };

    this.loading = true;
    this.teamService
      .updateTeam(this.teamId, teamData)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (updatedTeam) => {
          this.team = updatedTeam;
          this.showMessage('success', 'Success', 'Team updated successfully');
        },
        error: (error) => {
          console.error('Error saving team:', error);
          this.showMessage('error', 'Error', 'Failed to save team details');
        },
      });
  }

  get formControls() {
    return this.teamForm.controls;
  }

  getImage(url: string | undefined) {
    return url || 'assets/images/noimage.jpg';
  }

  onSelectImage(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (file) {
      this.coverFile = file;
      this.coverFileChange.emit(this.coverFile);
      this.readFile(file);
      this.uploadImage(file);
    }
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.imagePreviewChange.emit(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  private uploadImage(file: File): void {
    if (!this.teamId) return;

    this.loading = true;
    this.loadingChange.emit(this.loading);

    const filepath = `/teams/${this.teamId}/`;
    const filename = 'cover.png';

    this.fileService
      .upload(file, filepath, filename)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loadingChange.emit(this.loading);
          if (this.fileUpload) this.fileUpload.clear();
        })
      )
      .subscribe({
        next: (fileResponse) => {
          // Update the UI with the file URL without updating the team model
          this.imagePreview = fileResponse.url;
          this.imagePreviewChange.emit(this.imagePreview);
          this.showMessage(
            'success',
            'Success',
            'Team image updated successfully'
          );
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.showMessage(
            'error',
            'Error',
            'Failed to upload image'
          );
        },
      });
  }

  triggerFileUpload() {
    if (this.fileUpload?.advancedFileInput) {
      this.fileUpload.advancedFileInput.nativeElement.click();
    }
  }

  onImageError() {
    this.imagePreview = 'assets/images/noimage.jpg';
    this.imagePreviewChange.emit(this.imagePreview);
    if (this.team) {
      this.team.imageUrl = 'assets/images/noimage.jpg';
    }
  }

  private showMessage(
    severity: string,
    summary: string,
    detail: string,
    life = 3000
  ) {
    this.messageService.add({ severity, summary, detail, life });
  }
}
