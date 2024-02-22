import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ApiService } from './core/service/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  formData: FormData | null = null;

  filtred: boolean = false;
  pageSize: number = 5;
  originalData: any = [
    // {
    //   id: 86,
    //   word: 'I',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 87,
    //   word: 'am',
    //   stem: 'be',
    //   part_of_speech: 'VERB',
    //   endings: [
    //     {
    //       name: 'was',
    //       info: 'Verb, past tense',
    //     },
    //     {
    //       name: 'ing',
    //       info: 'Verb, gerund or present participle',
    //     },
    //     {
    //       name: 'is',
    //       info: 'Verb, 3rd person singular present',
    //     },
    //     {
    //       name: 'en',
    //       info: 'Verb, past participle',
    //     },
    //     {
    //       name: 'am',
    //       info: 'Verb, non-3rd person singular present',
    //     },
    //   ],
    // },
    // {
    //   id: 88,
    //   word: 'love',
    //   stem: 'love',
    //   part_of_speech: 'NOUN',
    //   endings: [
    //     {
    //       name: 's',
    //       info: 'Verb, 3rd person singular present',
    //     },
    //     {
    //       name: 'loving',
    //       info: 'Verb, gerund or present participle',
    //     },
    //     {
    //       name: 's',
    //       info: 'Noun, plural',
    //     },
    //     {
    //       name: 'd',
    //       info: 'Verb, past tense',
    //     },
    //   ],
    // },
    // {
    //   id: 89,
    //   word: 'big',
    //   stem: 'big',
    //   part_of_speech: null,
    //   endings: [
    //     {
    //       name: 'ger',
    //       info: 'Adjective, comparative',
    //     },
    //     {
    //       name: 'gest',
    //       info: 'Adjective, superlative',
    //     },
    //   ],
    // },
    // {
    //   id: 90,
    //   word: 'birds',
    //   stem: 'bird',
    //   part_of_speech: 'NOUN',
    //   endings: [
    //     {
    //       name: 's',
    //       info: 'Noun, plural',
    //     },
    //   ],
    // },
    // {
    //   id: 91,
    //   word: 'I',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 92,
    //   word: 'I',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 93,
    //   word: 'I',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 94,
    //   word: 'I',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 95,
    //   word: 'i',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 96,
    //   word: 'i',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
    // {
    //   id: 97,
    //   word: 'i',
    //   stem: 'i',
    //   part_of_speech: 'NOUN',
    //   endings: [],
    // },
  ];
  dataSlice: any = [];
  pageIndex: number = 0;

  selectsGroup!: FormGroup;
  findInput!: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setSliceArray(this.pageIndex);

    this.selectsGroup = this.fb.group({
      NOUN: [false],
      PROPN: [false],
      VERB: [false],
      ADJ: [false],
      ADV: [false],
    });

    this.findInput = this.fb.group({
      search: [''],
    });
    this.selectsGroup.valueChanges.subscribe((value) => {
      let keys: any = [];
      for (let key in value) {
        if (value[key]) {
          this.filtred = false;
          keys = [...keys, key];
        }
      }
      this.setSliceArray(this.pageIndex);
      if (keys.length) {
        this.filtred = true;
        this.dataSlice = this.dataSlice.filter((el: any) =>
          keys.find((val: any) => val === el.part_of_speech)
        );
      }
    });

    this.findInput.valueChanges.subscribe((value) => {
      if (!value.search.length) {
        this.filtred = false;
        this.setSliceArray(this.pageIndex);
      } else {
        this.filtred = true;
        this.dataSlice = this.dataSlice.filter((el: any) =>
          el['word'].includes(value.search)
        );
      }
    });
  }

  getFilterStatus() {
    const values = Object.values(this.selectsGroup.value);
    return values.find((el) => el === true)
      ? this.dataSlice.length
      : this.originalData.length;
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }

    let file: File = fileList[0];
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);

    this.formData = formData;
  }

  onClick() {
    this.apiService.sendFile(this.formData!).subscribe((response: any) => {
      this.originalData = response;
      this.setSliceArray(this.pageIndex);
      this.ref.markForCheck();
      console.log(response);
    });
  }

  onDelete(id: number) {
    console.log(id);
    this.apiService
      .deleteWord(id)
      .pipe(
        switchMap((word: any) => {
          return this.apiService.getAllWords();
        })
      )
      .subscribe((words: any) => {
        this.originalData = words;
        this.setSliceArray(this.pageIndex);
      });
  }

  changePage(event: any) {
    this.pageIndex = event.pageIndex;
    this.setSliceArray(this.pageIndex);
  }

  setSliceArray(pageIndex: number) {
    this.dataSlice = this.originalData.slice(
      pageIndex * this.pageSize,
      (pageIndex + 1) * this.pageSize
    );
  }

  openReductModal(word: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        id: word.id,
        word: word.word,
        stem: word.stem,
        part_of_speech: word.part_of_speech,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.originalData = result;
        this.setSliceArray(this.pageIndex);
        this.ref.markForCheck();
      }
    });
  }
}
