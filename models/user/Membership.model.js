const db = require("../../util/db");
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");

/**
 *
 * @param {data} usersdata
 * @param {string}
 * @returns success or error registration
 */

const becomeMember = async (data) => {
  try {
    bcrypt.hash(data.password, salt, function (err, hash) {
      db.execute(
        "INSERT INTO members(m_firstname, m_lastname, m_companyName, m_email, m_phone, m_dob, m_type, m_username, m_pwd) VALUES (?, ?, ?, ?, ?, ? , ? , ?, ?)",
        [
          data.firstName,
          data.m_lastname,
          data.m_companyName,
          data.email,
          data.phoneNumber,
          data.dateOfBirth,
          data.membershipType,
          data.userName,
          hash,
        ]
      ).then(() => {
        return { msg: "signedup" };
      });
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 *
 * @param {data} usersdata
 * @param {string}
 * @returns success or error registration
 */

const LoginMember = async (data) => {
  try {
    db.execute("SELECT * FROM members WHERE m_email = ?", [data.email]).then(
      (result) => {
        if (result[0].length == 0) {
          return { message: "email" };
        } else {
          bcrypt.compare(
            data.password,
            result[0][0].m_pwd,
            function (err, verify) {
              if (verify) {
        
            //  users JWT tokenization Is not done
                return {
                    message: "Signed In",
                    role: result[0][0].user_role,
                  };
              } else {
                return {message: "Incorrect password"}
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  becomeMember,
  LoginMember,
};
