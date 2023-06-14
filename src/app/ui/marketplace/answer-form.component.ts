import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AdQuestionView } from 'app/api/models';
import { AdQuestionsService } from 'app/api/services/ad-questions.service';
import { BasePageComponent } from 'app/ui/shared/base-page.component';
import { validateBeforeSubmit } from 'app/shared/helper';
import { Menu } from 'app/ui/shared/menu';

/**
 * Answer a question for simple/webshop ads
 */
@Component({
  selector: 'answer-form',
  templateUrl: 'answer-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswerFormComponent
  extends BasePageComponent<AdQuestionView>
  implements OnInit {

  id: string;
  answer = new FormControl(null, Validators.required);

  constructor(
    injector: Injector,
    private adQuestionService: AdQuestionsService) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.id = this.route.snapshot.params.id;
    this.addSub(this.adQuestionService.getAdQuestion({ id: this.id }).subscribe(data =>
      this.data = data,
    ));
  }

  submit() {
    if (!validateBeforeSubmit(this.answer)) {
      return;
    }
    this.addSub(this.adQuestionService.answerAdQuestion({
      id: this.id,
      body: this.answer.value,
    }).subscribe(() => {
      this.notification.snackBar(this.i18n.ad.questionAnswered);
      this.router.navigate(['/marketplace', 'unanswered-questions'], {
        replaceUrl: true,
      });
    }));
  }

  resolveMenu() {
    return Menu.UNANSWERED_QUESTIONS;
  }
}
