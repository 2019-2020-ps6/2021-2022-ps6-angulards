import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GameSession} from '../models/gamesession.model';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { serverUrl, httpOptionsBase } from '../configs/server.config';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  private sessions: GameSession[] = [];
  private sessionUrl = serverUrl + '/session'; // a changer si nécessaire
  private httpOptions = httpOptionsBase;

  constructor(private http: HttpClient) {
    // récuperer toutes les sessions de jeu (est ce qu'on fait la différence entre celles terminées, celles suspendues
    // ou bien on met tout dans le même tableau et on les différencie seulement à l'id?
    // a demander au prof mardi
  }

}

