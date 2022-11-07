import { Component, ElementRef, OnInit } from '@angular/core';
import { Intent } from '../../model/intent';
import { QueryInput } from '../../model/query-input';
import { TextInput } from '../../model/text-input';
import { DialogflowService } from 'src/app/service/dialogflow/dialogflow.service';
import { ViewChild } from '@angular/core';
import { Recommendation } from '../../model/recommendation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("askContainer") askContainer !: ElementRef;
  @ViewChild("buttonsContainer") buttonsContainer !: ElementRef;
  statement:string = "The first questions is:";
  question:string = "Do you like animated movies?";
  genre:string = "animated";
  recommendations:Recommendation[] = [];
  probabilities:number[] = [];
  visible:boolean = false;

  intent:Intent = {};
  queryInput:QueryInput = {};
  textInput:TextInput = {
    languageCode: 'en'
  };

  constructor(private dialogflowService:DialogflowService) { }

  ngOnInit(): void {
  }

  yesAnswer():any{
    this.textInput.text = `I like ${this.genre} movies`;
    this.queryInput.text = this.textInput;
    this.intent.queryInput = this.queryInput;
    this.dialogflowService.sendIntent(this.intent)
    .subscribe(
      data => {
        this.statement = "The next question is:"
        this.question = data.queryResult.fulfillmentText;
        this.genre = this.question.slice(this.question.indexOf("like") + "like".length);
        this.genre = this.genre.slice(0, this.genre.indexOf("movies"));
        this.genre = this.genre.trim();
        if(!this.question.includes("you like")){
          this.setResultTemplate();
        }
      }
    );
  }

  noAnswer():any{
    this.textInput.text = `I do not like ${this.genre} movies`;
    this.queryInput.text = this.textInput;
    this.intent.queryInput = this.queryInput;
    this.dialogflowService.sendIntent(this.intent)
    .subscribe(
      data => {
        this.question = data.queryResult.fulfillmentText;
        this.genre = this.question.slice(this.question.indexOf("like") + "like".length);
        this.genre = this.genre.slice(0, this.genre.indexOf("movies"));
        this.genre = this.genre.trim(); 
        if(!this.question.includes("you like")){
          this.setResultTemplate();
        }
      }
    );
  }

  backHome(){
    window.location.reload();
  }

  getProbabilities(length:number):number[]{
    let probabilitiesList:number[] = [];
    for(let i = 0; i < length; i ++ ){
      if(i > 0 && length <= 2){
        probabilitiesList.push(1 - probabilitiesList[0]);
      } 
      else if(i > 0 && length <= 3){
        if((probabilitiesList[0] + probabilitiesList[1]) >= 1){
          probabilitiesList[1] = 0.9 - probabilitiesList[0];
        }
        if(i == 2){
          probabilitiesList.push(1-(probabilitiesList[0] + probabilitiesList[1]));
        } 
        else{
          probabilitiesList.push(Math.random());
        }
      }
      else {
        probabilitiesList.push(Math.random());
      }
    }

    for(let i = 0; i < probabilitiesList.length; i ++){
      probabilitiesList[i] = Number(probabilitiesList[i].toFixed(2));
      probabilitiesList[i] = probabilitiesList[i] * 100;
    }
    return probabilitiesList;
  }

  setResultTemplate(){
    this.statement = "This is your recommendation:"
    this.buttonsContainer.nativeElement.innerHTML = ``;
    this.askContainer.nativeElement.innerHTML = ``;
    this.visible = true;
    let recommendationList = this.question.split(',');
    let probabilitiesList = this.getProbabilities(recommendationList.length);
    for(let i = 0; i < recommendationList.length; i ++){
      let recommendation:Recommendation = {
        name: recommendationList[i],
        probability: probabilitiesList[i]
      }
      this.recommendations.push(recommendation);
    }
  }
}
