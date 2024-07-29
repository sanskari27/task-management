import inviteToOrganization from './inviteToOrganization';
import resetPassword from './passwordReset';
import resetSuccessful from './resetSuccessful';
import signupTemplate from './signup';
import taskCreated from './taskCreated';
import taskReminder from './taskReminder';
import taskUpdate from './taskUpdate';
import welcomeTemplate from './welcome';

const EmailTemplates = {
	welcomeTemplate,
	resetPassword,
	resetSuccessful,
	signupTemplate,
	taskCreated,
	taskReminder,
	taskUpdate,
	inviteToOrganization,
};

export default EmailTemplates;
