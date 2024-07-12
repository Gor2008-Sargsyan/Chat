const bcryptjs = require("bcryptjs");

const hashPass = async (pass) => {
 return await bcryptjs.hash(pass, 10);
};

const comparePass = async (pass, hashedPass) => {
 return await bcryptjs.compare(pass, hashedPass);
};

module.exports = { hashPass, comparePass };
