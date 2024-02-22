import { ApiService } from './../../core/service/api.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  formModal: FormGroup = this.fb.group({
    word: [''],
    stem: [''],
    part_of_speech: [''],
  });

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.formModal.setValue({
      word: this.data.word,
      stem: this.data.stem,
      part_of_speech: this.data.part_of_speech,
    });
  }

  onUpdate() {
    let formValue = this.formModal.value;
    let formValueWithoutEmptyFields: any = {};
    for (let key in formValue) {
      if (formValue[key].length !== 0) {
        formValueWithoutEmptyFields[key] = formValue[key];
      }
    }
    this.apiService
      .updateWord(this.data.id, formValueWithoutEmptyFields)
      .pipe(
        switchMap((word: any) => {
          return this.apiService.getAllWords();
        })
      )
      .subscribe((words) => {
        this.dialogRef.close(words);
        this.ref.markForCheck();
      });
  }
}
