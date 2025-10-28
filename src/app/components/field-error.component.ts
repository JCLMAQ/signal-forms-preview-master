import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-field-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (fieldError().touched()) {
      @for (error of fieldError().errors(); track error.kind) {
        <div class="mt-1 text-sm text-red-600">{{ error.message }}</div>
      }
    }
  `,
})
export class FieldErrorComponent {
  fieldError = input.required<FieldState<any, any>>();
}
