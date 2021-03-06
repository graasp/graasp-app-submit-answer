export const INPUT_CYPRESS = 'input';
export const STUDENT_INPUT = `[data-cy=${INPUT_CYPRESS}] input#inputTextField`;
export const SAVE_INPUT_CYPRESS = 'save';
export const SAVE_INPUT_BUTTON = `[data-cy=${SAVE_INPUT_CYPRESS}]`;
export const APP_TITLE_CYPRESS = 'appTitle';
export const APP_TITLE_TEXT = `[data-cy=${APP_TITLE_CYPRESS}]`;
export const REFRESH_BUTTON_CYPRESS = 'refreshButton';
export const REFRESH_BUTTON = `[data-cy=${REFRESH_BUTTON_CYPRESS}]`;
export const LOGO_CYPRESS = 'logo';
export const LOGO_IMAGE = `[data-cy=${LOGO_CYPRESS}]`;
export const SETTINGS_BUTTON_CYPRESS = 'settingsButton';
export const SETTINGS_BUTTON = `[data-cy=${SETTINGS_BUTTON_CYPRESS}]`;
export const SETTINGS_MODAL_CYPRESS = 'settingsModal';
export const SETTINGS_MODAL = `[data-cy=${SETTINGS_MODAL_CYPRESS}]`;
export const RESPONSES_CYPRESS = 'responses';
export const RESPONSES_TABLE = `[data-cy=${RESPONSES_CYPRESS}]`;
export const HEADER_VISIBILITY_SWITCH_CYPRESS = 'headerVisibility';
export const HEADER_VISIBILITY_SWITCH = `[data-cy=${HEADER_VISIBILITY_SWITCH_CYPRESS}] input`;
export const SHOW_HINT_BUTTON_CYPRESS = 'showHint';
export const SHOW_HINT_BUTTON = `[data-cy=${SHOW_HINT_BUTTON_CYPRESS}]`;
export const ATTEMPT_INFORMATION_TEXT_CYPRESS = 'attemptInformation';
export const ATTEMPT_INFORMATION_TEXT = `[data-cy=${ATTEMPT_INFORMATION_TEXT_CYPRESS}]`;
export const TABLE_FIELDS = ['Student', 'Feedback', 'Input', 'Actions'];
export const HINT_ALERT_CYPRESS = 'hintAlert';
export const HINT_ALERT = `[data-cy=${HINT_ALERT_CYPRESS}]`;
export const CORRECT_ANSWER_FEEDBACK_ICON_CYPRESS = 'correctAnswerFeedbackIcon';
export const CORRECT_ANSWER_FEEDBACK_ICON = `[data-cy=${CORRECT_ANSWER_FEEDBACK_ICON_CYPRESS}]`;
export const INCORRECT_ANSWER_FEEDBACK_ICON_CYPRESS =
  'incorrectAnswerFeedbackIcon';
export const INCORRECT_ANSWER_FEEDBACK_ICON = `[data-cy=${INCORRECT_ANSWER_FEEDBACK_ICON_CYPRESS}]`;
export const DELETE_RESPONSE_BUTTON_CYPRESS = 'deleteResponseButton';
export const DELETE_RESPONSE_BUTTONS = `[data-cy=${DELETE_RESPONSE_BUTTON_CYPRESS}]`;
export const buildConfirmDeleteDialogId = (id) => `confirmDeleteDialog-${id}`;
export const buildDeleteButtonId = (id) => `deleteButton-${id}`;
export const FEEDBACK_BUTTON_CYPRESS = 'feedbackButton';
export const FEEDBACK_BUTTONS = `[data-cy=${FEEDBACK_BUTTON_CYPRESS}]`;
export const FEEDBACK_INPUT = `textarea#inputTextField`;
export const SAVE_FEEDBACK_BUTTON_CYPRESS = `[data-cy=submitButton]`;
export const STUDENT_FEEDBACK_TEXT = `[data-cy=input] .MuiFormHelperText-root`;
export const buildFeedbackButtonId = (id) => `feedbackButton-${id}`;
export const SAVE_SETTINGS_BUTTON_CYPRESS = 'saveSettingsButton';
export const SAVE_SETTINGS_BUTTON = `[data-cy=${SAVE_SETTINGS_BUTTON_CYPRESS}]`;
export const SHOW_AUTOMATIC_FEEDBACK_SWITCH_CYPRESS = 'showAutomaticFeedback';
export const SHOW_AUTOMATIC_FEEDBACK_SWITCH = `[data-cy=${SHOW_AUTOMATIC_FEEDBACK_SWITCH_CYPRESS}] input`;
export const HINT_INPUT_CYPRESS = 'hintInput';
export const HINT_INPUT = `[data-cy=${HINT_INPUT_CYPRESS}] input`;
export const NUM_ATTEMPTS_ALLOWED_INPUT_CYPRESS = 'numAttemptsAllowed';
export const NUM_ATTEMPTS_ALLOWED_INPUT = `[data-cy=${NUM_ATTEMPTS_ALLOWED_INPUT_CYPRESS}] input`;
export const CONFIRM_DIALOG_CONFIRM_BUTTON_CYPRESS =
  'confirmDialogConfirmButton';
export const buildConfirmDeleteDialogConfirmSelector = (id) =>
  `#${buildConfirmDeleteDialogId(
    id
  )} [data-cy=${CONFIRM_DIALOG_CONFIRM_BUTTON_CYPRESS}]`;
