import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Tooltip,
  InputAdornment,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import {
  getAppInstanceResources,
  postAppInstanceResource,
  postAction,
} from '../../../actions';
import { FEEDBACK, INPUT } from '../../../config/appInstanceResourceTypes';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH } from '../../../config/settings';
import {
  HID_HINT,
  SHOWED_HINT,
  SAVED,
  SUBMITTED_CORRECT_ANSWER,
  SUBMITTED_INCORRECT_ANSWER,
} from '../../../config/verbs';
import {
  INPUT_CYPRESS,
  SAVE_INPUT_CYPRESS,
  SHOW_HINT_BUTTON_CYPRESS,
  ATTEMPT_INFORMATION_TEXT_CYPRESS,
  HINT_ALERT_CYPRESS,
  CORRECT_ANSWER_FEEDBACK_ICON_CYPRESS,
  INCORRECT_ANSWER_FEEDBACK_ICON_CYPRESS,
} from '../../../config/selectors';

const styles = (theme) => ({
  main: {
    textAlign: 'center',
    flex: 1,
    padding: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  },
  message: {
    padding: theme.spacing.unit,
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(1),
    float: 'right',
  },
  buttons: {
    marginRight: theme.spacing(1),
  },
  indicator: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

class StudentView extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    dispatchPostAction: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      container: PropTypes.string,
      message: PropTypes.string,
      button: PropTypes.string,
      buttons: PropTypes.string,
      textField: PropTypes.string,
      indicator: PropTypes.string,
    }).isRequired,
    feedback: PropTypes.string,
    userId: PropTypes.string,
    ready: PropTypes.bool,
    standalone: PropTypes.bool.isRequired,
    text: PropTypes.string,
    settings: PropTypes.shape({
      hint: PropTypes.string,
      answer: PropTypes.string,
      showAutomaticFeedback: PropTypes.bool,
      numAttemptsAllowed: PropTypes.number,
    }).isRequired,
    numAttempts: PropTypes.number.isRequired,
  };

  static defaultProps = {
    feedback: '',
    userId: null,
    ready: false,
    text: null,
  };

  state = (() => {
    const { text } = this.props;
    return {
      text,
      showHint: false,
    };
  })();

  componentDidMount() {
    const { userId, dispatchGetAppInstanceResources } = this.props;

    // get the resources for this user
    dispatchGetAppInstanceResources({ userId });
  }

  componentDidUpdate({ text: prevPropText }, { text: prevStateText }) {
    const { text } = this.props;

    // set state here safely by ensuring that it does not cause an infinite loop
    if (prevPropText !== text && prevStateText !== text) {
      // eslint-disable-next-line
      this.setState({ text });
    }
  }

  handleChangeText = ({ target }) => {
    const { value } = target;
    this.setState({
      text: value,
    });
  };

  handleShowHint = () => {
    const {
      dispatchPostAction,
      text,
      numAttempts,
      settings: { numAttemptsAllowed },
    } = this.props;
    const { text: currentText } = this.state;

    this.setState({
      showHint: true,
    });

    dispatchPostAction({
      verb: SHOWED_HINT,
      data: {
        currentText,
        submittedText: text,
        numAttempts,
        numAttemptsAllowed,
      },
    });
  };

  handleHideHint = () => {
    const {
      dispatchPostAction,
      text,
      numAttempts,
      settings: { numAttemptsAllowed },
    } = this.props;
    const { text: currentText } = this.state;
    this.setState({
      showHint: false,
    });
    dispatchPostAction({
      verb: HID_HINT,
      data: {
        currentText,
        submittedText: text,
        numAttempts,
        numAttemptsAllowed,
      },
    });
  };

  handleSubmitAnswer = (e) => {
    e.preventDefault();
    const {
      dispatchPostAppInstanceResource,
      dispatchPostAction,
      userId,
      numAttempts,
      settings: { numAttemptsAllowed, answer },
    } = this.props;

    // trim text
    this.setState(
      (prevState) => {
        const { text: prevText } = prevState;
        return { text: _.trim(prevText) };
      },
      () => {
        const { text: currentText } = this.state;
        dispatchPostAppInstanceResource({
          data: currentText,
          type: INPUT,
          userId,
        });

        dispatchPostAction({
          verb: SAVED,
          data: {
            answer: currentText,
            numAttempts,
            numAttemptsAllowed,
          },
        });

        // correct answer submitted
        if (currentText === answer) {
          dispatchPostAction({
            verb: SUBMITTED_CORRECT_ANSWER,
            data: {
              answer: currentText,
              numAttempts,
              numAttemptsAllowed,
            },
          });
        }
        // incorrect answer submitted
        else {
          dispatchPostAction({
            verb: SUBMITTED_INCORRECT_ANSWER,
            data: {
              answer: currentText,
              numAttempts,
              numAttemptsAllowed,
            },
          });
        }
      }
    );
  };

  withTooltip = (elem, title, text, disabled) => (
    <Tooltip title={title}>
      <span>{React.cloneElement(elem, { children: text, disabled })}</span>
    </Tooltip>
  );

  renderButtons() {
    const {
      t,
      classes,
      text: propsText,
      numAttempts,
      settings: { hint, numAttemptsAllowed },
    } = this.props;
    const { text: stateText, showHint } = this.state;

    // enable save button if text is different and has attempts
    const textIsDifferent = stateText !== propsText;
    const hasAttempts = numAttempts < numAttemptsAllowed;

    // if there is a hint, we show the show hint button
    const hasHint = Boolean(hint);

    const submitButton = (
      <Button
        type="submit"
        data-cy={SAVE_INPUT_CYPRESS}
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={this.handleSubmitAnswer}
      >
        {t('Submit')}
      </Button>
    );

    // by default just render the button
    let buttonToRender = submitButton;

    // add tooltip if all changes saved
    if (!textIsDifferent) {
      buttonToRender = this.withTooltip(
        submitButton,
        t('All changes saved.'),
        t('Submitted'),
        true
      );
    }

    // add tooltip if attempts have been exhausted
    if (!hasAttempts) {
      buttonToRender = this.withTooltip(
        submitButton,
        t('You have no more attempts left.'),
        t('Submitted'),
        true
      );
    }

    const showHintButton = (
      <Button
        data-cy={SHOW_HINT_BUTTON_CYPRESS}
        variant="link"
        color="primary"
        onClick={this.handleShowHint}
        className={classes.button}
        disabled={showHint}
      >
        {t('Show Hint')}
      </Button>
    );

    return (
      <>
        <div className={classes.buttons}>
          {buttonToRender}
          {hasHint && showHintButton}
        </div>
      </>
    );
  }

  render() {
    const {
      t,
      classes,
      ready,
      standalone,
      numAttempts,
      text: propsText,
      settings: { numAttemptsAllowed, hint, answer, showAutomaticFeedback },
    } = this.props;
    const { text, showHint } = this.state;
    let { feedback } = this.props;
    if (feedback && feedback !== '') {
      feedback = `${t('Feedback')}: ${feedback}`;
    }

    if (!standalone && !ready) {
      return <Loader />;
    }

    const hasTextChanged = propsText !== text;

    const hasAttempts = numAttempts < numAttemptsAllowed;

    const isCorrect = propsText === answer;

    const automaticFeedback =
      showAutomaticFeedback && numAttempts && !hasTextChanged ? (
        <InputAdornment position="end">
          {isCorrect ? (
            <Tooltip title={t('You submitted the correct answer.')}>
              <CheckCircleOutlineIcon
                data-cy={CORRECT_ANSWER_FEEDBACK_ICON_CYPRESS}
                color="primary"
              />
            </Tooltip>
          ) : (
            <Tooltip title={t('You submitted the wrong answer.')}>
              <HighlightOffIcon
                data-cy={INCORRECT_ANSWER_FEEDBACK_ICON_CYPRESS}
                color="primary"
              />
            </Tooltip>
          )}
        </InputAdornment>
      ) : null;

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          {showHint && (
            <Alert
              data-cy={HINT_ALERT_CYPRESS}
              onClose={this.handleHideHint}
              className={classes.indicator}
              severity="info"
            >
              {hint}
            </Alert>
          )}

          <form
            className={classes.container}
            noValidate
            autoComplete="off"
            onSubmit={this.handleSubmitAnswer}
          >
            <TextField
              autoFocus={standalone}
              InputProps={{
                inputProps: {
                  maxLength: MAX_INPUT_LENGTH,
                },
                endAdornment: automaticFeedback,
              }}
              data-cy={INPUT_CYPRESS}
              key="inputTextField"
              id="inputTextField"
              label={t('Type Here')}
              value={text}
              onChange={this.handleChangeText}
              className={classes.textField}
              margin="normal"
              helperText={feedback}
              variant="outlined"
              disabled={!hasAttempts}
              fullWidth
            />
          </form>
          <Typography
            variant="body2"
            className={classes.indicator}
            align="right"
            color="textSecondary"
            data-cy={ATTEMPT_INFORMATION_TEXT_CYPRESS}
          >
            {`${t(
              'You have submitted'
            )} ${numAttempts}/${numAttemptsAllowed} ${t('attempts allowed')}.`}
          </Typography>
          {this.renderButtons()}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ context, appInstance, appInstanceResources }) => {
  const { userId, offline, standalone } = context;
  const { settings } = appInstance.content;
  const inputResources = appInstanceResources.content.filter(
    ({ user, type }) => user === userId && type === INPUT
  );
  const feedbackResource = appInstanceResources.content.find(
    ({ user, type }) => user === userId && type === FEEDBACK
  );

  // only look at first resource
  // these are already reverse sorted by createdAt in the action
  const [inputResource] = inputResources.slice(0);

  // but count the number of responses
  const numAttempts = inputResources?.length || 0;

  return {
    userId,
    offline,
    standalone,
    settings,
    numAttempts,
    ready: appInstanceResources.ready,
    text: inputResource && inputResource.data,
    feedback: feedbackResource && feedbackResource.data,
  };
};

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPostAction: postAction,
};

const StyledComponent = withStyles(styles)(StudentView);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
