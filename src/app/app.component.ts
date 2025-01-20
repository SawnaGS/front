import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AxiosService} from './service/axios/axios.service';
import {TestDTO} from './model/test';
import {NgFor} from '@angular/common';
import {generate} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'Test';
  testForm: any;
  test: TestDTO | undefined;
  score: number | undefined;
  rank: number | undefined;
  constructor(private formBuilder: FormBuilder, private axiosService: AxiosService) { }

  async ngOnInit() {
    this.testForm = this.formBuilder.group({
      username: ['', Validators.required],
      userAnswer: ['', Validators.required],
    });
    this.test = await this.generate();
  }

  async generate(): Promise<TestDTO | undefined> {
    try {
      const response = await this.axiosService.request(
        'GET',
        '/api/test/generate',
        {}
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Not ok:', error);
      return undefined;
    }
  }

  onSubmit() {
    this.axiosService.request(
      "POST",
      "/api/test/submit",
      {
        "username": this.testForm.value.username,
        "userAnswer": this.testForm.value.userAnswer,
        "correctAnswer": this.test?.correctAnswer,
        "task": this.test?.task
      }
    ).then(async r => {
      console.log(r);
      this.score = r.data.score
      this.rank = r.data.rank
      this.test = await this.generate();
    }).catch(e => {
      console.log("not ok");
    });
  }
}
