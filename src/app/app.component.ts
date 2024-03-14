import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ApiService } from './core/service/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  formData: FormData | null = null;

  filtred: boolean = false;
  pageSize: number = 5;
  startData: any = [];
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
    {
      sentence: 'so he go to school',
      words: [
        {
          word: 'so',
          info: {
            stem: 'so',
            part_of_speech: 'PROPN',
          },
        },
        {
          word: 'he',
          info: {
            stem: 'he',
            part_of_speech: 'NOUN',
          },
        },
        {
          word: 'go',
          info: {
            stem: 'go',
            part_of_speech: 'VERB',
          },
        },
        {
          word: 'to',
          info: {
            stem: 'so',
            part_of_speech: 'PROPN',
          },
        },
        {
          word: 'school',
          info: {
            stem: 'school',
            part_of_speech: 'NOUN',
          },
        },
      ],
    },
    {
      sentence: 'so he to school',
      words: [
        {
          word: 'so',
          info: {
            stem: 'so',
            part_of_speech: 'PROPN',
          },
        },
        {
          word: 'he',
          info: {
            stem: 'he',
            part_of_speech: 'NOUN',
          },
        },
        {
          word: 'to',
          info: {
            stem: 'so',
            part_of_speech: 'PROPN',
          },
        },
        {
          word: 'school',
          info: {
            stem: 'school',
            part_of_speech: 'NOUN',
          },
        },
      ],
    },
  ];
  dataSlice: any = [];
  pageIndex: number = 0;

  selectsGroup!: FormGroup;
  findInput!: FormGroup;

  allPartsOfSpeech = ['NOUN', 'PROPN', 'VERB', 'ADJ', 'ADV'];
  partsOfSpeech: string[] = [];
  @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputStates$ = new BehaviorSubject<any>([]);
  renderedDataSlice$: any = new Subject();

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setSliceArray(this.pageIndex);
    this.renderedDataSlice$.next(this.originalData);
    // this.renderedDataSlice$.subscribe((el: any) => console.log(el));

    this.apiService.getAllSentences().subscribe((words) => {
      this.startData = words;
      this.originalData = words;
      this.setSliceArray(this.pageIndex);
      this.ref.markForCheck();
    });

    this.selectsGroup = this.fb.group({
      NOUN: [false],
      PROPN: [false],
      VERB: [false],
      ADJ: [false],
      ADV: [false],
    });

    this.findInput = this.fb.group({
      search: [''],
      patternSearching: [''],
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
        this.originalData = this.startData.filter((el: any) =>
          keys.find((val: any) => val === el.part_of_speech)
        );

        this.setSliceArray(this.pageIndex);
      } else {
        this.originalData = this.startData;
        this.setSliceArray(this.pageIndex);
      }
    });

    this.findInput.valueChanges.subscribe((value) => {
      if (!value.search.length) {
        this.filtred = false;
        this.setSliceArray(this.pageIndex);
      } else {
        this.filtred = true;
        this.dataSlice = this.originalData.filter((el: any) =>
          el['word'].includes(value.search)
        );
      }
    });

    // this.inputStates$.subscribe((value) => {
    //   if (!value.length) {
    //     this.filtred = false;
    //     this.setSliceArray(this.pageIndex);
    //   } else {
    //     console.log(value);
    //     this.filtred = true;
    //     this.dataSlice = this.searchPattern(this.originalData);
    //     this.renderedDataSlice$.next(this.dataSlice);
    //     console.log(this.dataSlice);
    //     this.ref.markForCheck();
    //   }
    // });
  }

  ngAfterViewInit(): void {
    this.inputStates$.subscribe((value) => {
      if (!value.length) {
        this.filtred = false;
        this.setSliceArray(this.pageIndex);
        console.log(this.dataSlice, 'HIHIHAHA');
        this.renderedDataSlice$.next(this.dataSlice);
      } else {
        console.log(value);
        this.filtred = true;
        this.dataSlice = this.searchPattern(this.originalData);
        this.renderedDataSlice$.next(this.dataSlice);
        console.log(this.dataSlice);
        this.ref.markForCheck();
      }
    });
  }

  getFilterStatus() {
    const values = Object.values(this.selectsGroup.value);
    return values.find((el) => el === true)
      ? this.originalData.length
      : this.startData.length;
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
    this.apiService
      .sendCorpus(this.formData!)
      .pipe(
        switchMap((response) => {
          return this.apiService.getAllSentences();
        })
      )
      .subscribe((words: any) => {
        this.originalData = words;
        this.setSliceArray(this.pageIndex);
        this.ref.markForCheck();
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
        this.ref.markForCheck();
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
    // this.renderedDataSlice$.next(this.dataSlice);
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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.partsOfSpeech.push(value);
      this.inputStates$.next(this.partsOfSpeech);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.findInput.get('patternSearching')!.setValue(null);
  }

  remove(partOfSpeech: string): void {
    const index = this.partsOfSpeech.indexOf(partOfSpeech);

    if (index >= 0) {
      this.partsOfSpeech.splice(index, 1);
      this.inputStates$.next(this.partsOfSpeech);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.partsOfSpeech.push(event.option.viewValue);
    this.inputStates$.next(this.partsOfSpeech);
    this.fruitInput.nativeElement.value = '';
    this.findInput.get('patternSearching')!.setValue(null);
  }

  formSearchPattern(patterns: string[]) {
    let searchingPattern = [];
    for (let pattern of patterns) {
      if (this.allPartsOfSpeech.indexOf(pattern) !== -1) {
        searchingPattern.push({
          pattern,
        });
      } else {
        searchingPattern.push({
          pattern: 'value',
          value: pattern,
        });
      }
    }
    return searchingPattern;
  }

  searchPattern(data: any) {
    const searchingPattern = this.formSearchPattern(this.partsOfSpeech);
    let findedPatterns = [];
    let valueIndex = -1;
    for (let [index, pattern] of searchingPattern.entries()) {
      if (pattern.pattern === 'value') {
        valueIndex = index;
        break;
      }
    }
    if (valueIndex !== -1) {
      for (let sentense of data) {
        let sentancePattern = [];
        for (let [wordIndex, word] of sentense.words.entries()) {
          if (word.word === searchingPattern[valueIndex].value) {
            let findedPattern = sentense.words.slice(
              wordIndex - valueIndex,
              wordIndex + (searchingPattern.length - valueIndex)
            );
            if (this.comparePatterns(searchingPattern, findedPattern)) {
              sentancePattern.push(...findedPattern);
            }
          }
        }
        findedPatterns.push({
          sentence: sentense.sentence,
          words: sentancePattern,
        });
      }
    } else {
      for (let sentense of data) {
        let sentancePattern = [];
        for (let [wordIndex, word] of sentense.words.entries()) {
          if (word.info.part_of_speech === searchingPattern[0].pattern) {
            let findedPattern = sentense.words.slice(
              wordIndex,
              wordIndex + searchingPattern.length
            );
            if (this.comparePatterns(searchingPattern, findedPattern)) {
              sentancePattern.push(...findedPattern);
            }
          }
        }
        findedPatterns.push({
          sentence: sentense.sentence,
          words: sentancePattern,
        });
      }
    }
    return findedPatterns;
  }

  comparePatterns(searchingPattern: any, findedPattern: any) {
    console.log(searchingPattern);
    console.log(findedPattern);
    for (let i = 0; i < searchingPattern.length; i++) {
      if (
        searchingPattern[i].pattern !== 'value' &&
        searchingPattern[i].pattern !== findedPattern[i].info.part_of_speech
      ) {
        console.log(findedPattern[i].info);
        console.log(searchingPattern[i].pattern);
        return false;
      } else if (
        searchingPattern[i].pattern === 'value' &&
        searchingPattern[i].value !== findedPattern[i].word
      ) {
        return false;
      }
    }
    return true;
  }

  getSentanse(sentance: any) {
    let predl = [];
    for (let word of sentance) {
      predl.push(word.word);
    }
    return predl.join(' ');
  }
}
