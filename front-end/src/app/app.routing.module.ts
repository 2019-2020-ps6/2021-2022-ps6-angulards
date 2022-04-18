import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { EditQuizComponent } from './quizzes/edit-quiz/edit-quiz.component';
import { RegisterComponent } from './users/register/register.component';
import {WelcomePageComponent} from './welcomepage/welcomepage';
import {LoginComponent} from './login/login.component';
import {UserQuizListComponent} from './homepage-user/userquiz-list/userquiz-list.component';
import {QuizFormComponent} from './quizzes/quiz-form/quiz-form.component';
import {QuizPageComponent} from './quiz-page/quiz-page.component';
import {Statistic} from './statistic/statistic';
import {AdminLoginComponent} from './adminspace/login/admin-login.component';

const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'quiz-list', component: QuizListComponent},
    {path: 'edit-quiz/:id', component: EditQuizComponent},
    { path: '', redirectTo: '/welcomepage', pathMatch: 'full' },
    {path: 'welcomepage', component: WelcomePageComponent},
    {path: 'login', component: LoginComponent},
    // {path: 'register', component: RegisterComponent},
    {path: 'userquiz', component: UserQuizListComponent},
    {path: 'quiz-form', component: QuizFormComponent},
    {path: 'quizzes/:id', component: QuizPageComponent},
    {path: 'stat', component: Statistic},
    {path: 'admin-login', component: AdminLoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
