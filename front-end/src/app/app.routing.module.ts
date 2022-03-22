import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { EditQuizComponent } from './quizzes/edit-quiz/edit-quiz.component';
import { UserListComponent } from './users/user-list/user-list.component';
import {WelcomePageComponent} from './welcomepage/welcomepage';
import {LoginComponent} from './login/login';
import {RegisterComponent} from './registerpage/registerpage';
import {UserQuizComponent} from './homepage-user/userquiz/userquiz.component';
import {UserQuizListComponent} from './homepage-user/userquiz-list/userquiz-list.component';

const routes: Routes = [
    {path: 'user-list', component: UserListComponent},
    {path: 'quiz-list', component: QuizListComponent},
    {path: 'edit-quiz/:id', component: EditQuizComponent},
    { path: '', redirectTo: '/welcomepage', pathMatch: 'full' },
    {path: 'welcomepage', component: WelcomePageComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'userquiz', component: UserQuizListComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
