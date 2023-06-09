const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "stevie.zulauf96@ethereal.email",
		pass: "mqSmwhT8jKzX8dtDN2",
	},
});

const sendMail = (info) => {
	return new Promise(async (resolve, reject) => {
		try {
			let result = await transporter.sendMail(info);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

const emailProcess = async ({ email, pin, type }) => {
	let info = "";
	switch (type) {
		case "reset-password-request":
			info = {
				// sender address
				from: '"From CRM" <stevie.zulauf96@ethereal.email>',
				// list of receivers
				to: email,
				// Subject line
				subject: "Password Reset Pin ✔",
				// plain text body
				text: "Your password rest pin " + pin,
				// html body
				html: `<b>Hello</b> Here is your pin <b>${pin}</b> This pin will expires in 1day`,
			};

			sendMail(info);
			break;

		case "password-update-request":
			info = {
				// sender address
				from: '"From CRM" <stevie.zulauf96@ethereal.email>',
				// list of receivers
				to: email,
				// Subject line
				subject: "Password Updated ✔",
				// plain text body
				text: "Your password updated successfully ",
				// html body
				html: `Hey, Your password updated successfully`,
			};
			sendMail(info);
			break;

		default:
			break;
	}
};

module.exports = { emailProcess };
