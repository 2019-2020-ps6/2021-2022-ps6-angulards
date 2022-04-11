import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { QuizComponent } from './quizzes/quiz/quiz.component';
import { HeaderComponent } from './header/header.component';
import { QuizFormComponent } from './quizzes/quiz-form/quiz-form.component';
import { EditQuizComponent } from './quizzes/edit-quiz/edit-quiz.component';
import { QuestionUploadComponent} from './questions/question-upload/question-upload.component';
import { AppRoutingModule } from './app.routing.module';
import { QuestionListComponent } from './questions/question-list/question-list.component';
import { QuestionFormComponent } from './questions/question-form/question-form.component';
import { QuestionComponent } from './questions/question/question.component';
import { UserComponent } from './users/user/user.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { RegisterComponent } from './users/register/register.component';
import {WelcomePageComponent} from './welcomepage/welcomepage';
import {LoginComponent} from './login/login.component';
import {UserQuizComponent} from './homepage-user/userquiz/userquiz.component';
import {UserQuizListComponent} from './homepage-user/userquiz-list/userquiz-list.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import {Statistic} from './statistic/statistic';
import {SafePipe} from "../../SafePipe";

@NgModule({
  declarations: [
    AppComponent,
    QuizListComponent,
    QuizComponent,
    HeaderComponent,
    QuizFormComponent,
    EditQuizComponent,
    QuestionListComponent,
    QuestionFormComponent,
    QuestionComponent,
    UserComponent,
    UserFormComponent,
    WelcomePageComponent,
    LoginComponent,
    UserQuizComponent,
    SafePipe,
    UserQuizListComponent,
    QuizPageComponent,
    QuestionUploadComponent,
    RegisterComponent,
    Statistic,
  ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
