import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { WordInfoComponent } from './components/word-info/word-info.component';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from '@angular/material/tooltip';

import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    WordInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatPaginatorModule,
    MatCardModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
      ReactiveFormsModule,
      MatTooltipModule,
      MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
