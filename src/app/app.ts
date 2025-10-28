import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  apply,
  customError,
  disabled,
  Field,
  form,
  required,
  schema,
  validate,
} from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';
import { FieldErrorComponent } from './components/field-error.component';
import { PersonalInfo } from './models/personal-info';

const passwordSchema = schema<{ password: string; confirmPassword: string }>((path) => {
  required(path.password, { message: 'Password is required' });
  required(path.confirmPassword, { message: 'Confirm Password is required' });
  validate(path, ({ valueOf }) => {
    const password = valueOf(path.password);
    const confirmPassword = valueOf(path.confirmPassword);

    if (password && confirmPassword && password !== confirmPassword) {
      return customError({
        kind: 'passwordsMismatch',
        message: 'Password should match',
      });
    }

    return null;
  });
});

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Field, JsonPipe, FieldErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to a not-so-simple form!</h1>
        <p class="text-gray-600">
          Signal Form with Custom validations, Cross-field validations, and Conditional fields
        </p>
      </div>

      <div class="flex gap-6 justify-center">
        <div class="bg-white shadow-lg rounded-lg p-8 w-[600px]">
          <form class="space-y-6">
            <!-- Basic Information Section -->
            <div class="border-b border-gray-200 pb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- First Name -->
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    [field]="personalForm.firstName"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your first name"
                  />
                  <app-field-error [fieldError]="personalForm.firstName()" />
                </div>

                <!-- Last Name -->
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    [field]="personalForm.lastName"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your last name"
                  />
                  <app-field-error [fieldError]="personalForm.lastName()" />
                </div>
              </div>

              <!-- Date of Birth with Custom Age Validation -->
              <div class="mt-4">
                <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  [field]="personalForm.dateOfBirth"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <app-field-error [fieldError]="personalForm.dateOfBirth()" />
              </div>
            </div>

            <!-- Password Section with Custom Validation -->
            <div class="border-b border-gray-200 pb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Password Security</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Password with Custom Strength Validation -->
                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    [field]="personalForm.password"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter a strong password"
                  />
                  <app-field-error [fieldError]="personalForm.password()" />
                </div>

                <!-- Confirm Password with Cross-field Validation -->
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    [field]="personalForm.confirmPassword"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                  <app-field-error [fieldError]="personalForm.confirmPassword()" />
                </div>

                <app-field-error [fieldError]="personalForm()" />
              </div>
            </div>

            <!-- Conditional Fields Section -->
            <div class="border-b border-gray-200 pb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>

              <!-- Emergency Contact (Conditional Field) -->
              <div class="mb-4">
                <div class="flex items-center mb-3">
                  <input
                    id="hasEmergencyContact"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    [field]="personalForm.hasEmergencyContact"
                  />
                  <label for="hasEmergencyContact" class="ml-2 block text-sm text-gray-700">
                    I have an emergency contact
                  </label>
                </div>

                <div class="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="emergencyContactName"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Emergency Contact Name
                    </label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      [field]="personalForm.emergencyContactName"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter emergency contact name"
                    />
                    <app-field-error [fieldError]="personalForm.emergencyContactName()" />
                  </div>

                  <div>
                    <label
                      for="emergencyContactPhone"
                      class="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Emergency Contact Phone
                    </label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      [field]="personalForm.emergencyContactPhone"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter emergency contact phone"
                    />
                    <app-field-error [fieldError]="personalForm.emergencyContactPhone()" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4">
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Submit Personal Details
              </button>
            </div>
          </form>
        </div>
        <div class="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Form Data:</h3>
          <pre class="text-xs text-gray-600 mb-2">{{ personalForm().value() | json }}</pre>
          <pre class="text-xs text-gray-600">{{ personalForm().errorSummary() | json }}</pre>
        </div>
      </div>
    </div>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  personalInfo = signal<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    password: '',
    confirmPassword: '',
    hasEmergencyContact: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  // personalForm = form(this.personalInfo)
  personalForm = form<PersonalInfo>(this.personalInfo, (path) => {
    required(path.firstName, { message: 'First Name is required' });
    required(path.lastName, { message: 'Last Name is required' });
    required(path.dateOfBirth, { message: 'Date of Birth is required' });

    validate(path.dateOfBirth, ({ value }) => {
      const years = new Date().getFullYear() - value().getFullYear();
      if (years < 18) {
        return customError({
          message: 'You must be at least 18 years old',
          kind: 'minAge',
        });
      }

      return null;
    });

    apply(path, passwordSchema);

    required(path.emergencyContactName, {
      message: 'Name is required',
      when: ({ valueOf }) => valueOf(path.hasEmergencyContact),
    });
    required(path.emergencyContactPhone, {
      message: 'Phone is required',
      when: ({ valueOf }) => valueOf(path.hasEmergencyContact),
    });
    disabled(path.emergencyContactName, ({ valueOf }) => !valueOf(path.hasEmergencyContact));
    disabled(path.emergencyContactPhone, ({ valueOf }) => !valueOf(path.hasEmergencyContact));
  });
}
