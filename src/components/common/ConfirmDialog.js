import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { CONFIRM_DIALOG_CONFIRM_BUTTON_CYPRESS } from '../../config/selectors';

const ConfirmDialog = (props) => {
  const {
    open,
    handleClose,
    handleConfirm,
    title,
    text,
    confirmText,
    cancelText,
    dataCy,
    id,
  } = props;
  return (
    <div>
      <Dialog
        id={id}
        data-cy={dataCy}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            color="secondary"
            data-cy={CONFIRM_DIALOG_CONFIRM_BUTTON_CYPRESS}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  dataCy: PropTypes.string,
  id: PropTypes.string,
};

ConfirmDialog.defaultProps = {
  text: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  dataCy: '',
  id: '',
};

export default ConfirmDialog;
