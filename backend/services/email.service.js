const { sendEmail } = require('../config/nodemailer');

const EMAIL_TEMPLATES = {
  verification: (code) => ({
    subject: 'Verify your EDUCOURS account / Vérifiez votre compte EDUCOURS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a56db;">EDUCOURS</h1>
          <p style="color: #6b7280;">Learn. Understand. Succeed.</p>
        </div>
        <h2>Welcome to EDUCOURS! / Bienvenue sur EDUCOURS !</h2>
        <p>Your verification code is / Votre code de vérification est :</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a56db; background: #f3f4f6; padding: 15px 30px; border-radius: 8px;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes. / Ce code expirera dans 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">EDUCOURS - Apprendre. Comprendre. Réussir.</p>
      </div>
    `,
  }),

  welcome: (fullName, language) => ({
    subject: language === 'fr'
      ? 'Bienvenue sur EDUCOURS !'
      : 'Welcome to EDUCOURS!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a56db;">${language === 'fr' ? 'Bienvenue' : 'Welcome'}, ${fullName}!</h1>
        <p>${language === 'fr'
          ? 'Votre compte EDUCOURS est maintenant actif. Commencez à apprendre dès aujourd\'hui !'
          : 'Your EDUCOURS account is now active. Start learning today!'}</p>
        <p>${language === 'fr'
          ? 'Explorez nos cours, discutez avec notre tuteur IA et suivez votre progression.'
          : 'Explore our courses, chat with our AI tutor, and track your progress.'}</p>
      </div>
    `,
  }),

  resetPassword: (code) => ({
    subject: 'Password Reset / Réinitialisation du mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset / Réinitialisation du mot de passe</h2>
        <p>Your reset code is / Votre code de réinitialisation est :</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a56db; background: #f3f4f6; padding: 15px 30px; border-radius: 8px;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes. / Ce code expirera dans 10 minutes.</p>
      </div>
    `,
  }),

  ticketUpdate: (ticketId, status, language) => ({
    subject: language === 'fr'
      ? `Ticket #${ticketId} mis à jour`
      : `Ticket #${ticketId} updated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>${language === 'fr' ? 'Mise à jour du ticket' : 'Ticket Update'}</h2>
        <p>${language === 'fr'
          ? `Votre ticket #${ticketId} est maintenant : <strong>${status}</strong>`
          : `Your ticket #${ticketId} is now: <strong>${status}</strong>`}</p>
        <p>${language === 'fr'
          ? 'Connectez-vous pour voir la réponse.'
          : 'Log in to view the response.'}</p>
      </div>
    `,
  }),

  broadcast: (title, message) => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a56db;">${title}</h2>
        <p>${message}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">EDUCOURS - Apprendre. Comprendre. Réussir.</p>
      </div>
    `,
  }),
};

const sendVerificationEmail = async (email, code) => {
  const template = EMAIL_TEMPLATES.verification(code);
  return sendEmail({ to: email, ...template });
};

const sendWelcomeEmail = async (email, fullName, language) => {
  const template = EMAIL_TEMPLATES.welcome(fullName, language);
  return sendEmail({ to: email, ...template });
};

const sendResetPasswordEmail = async (email, code) => {
  const template = EMAIL_TEMPLATES.resetPassword(code);
  return sendEmail({ to: email, ...template });
};

const sendTicketUpdateEmail = async (email, ticketId, status, language) => {
  const template = EMAIL_TEMPLATES.ticketUpdate(ticketId, status, language);
  return sendEmail({ to: email, ...template });
};

const sendBroadcastEmail = async (email, title, message) => {
  const template = EMAIL_TEMPLATES.broadcast(title, message);
  return sendEmail({ to: email, ...template });
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendTicketUpdateEmail,
  sendBroadcastEmail,
};
