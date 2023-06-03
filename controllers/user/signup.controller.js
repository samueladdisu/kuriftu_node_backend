const db = require("../../util/db");
const axios = require("axios");

const { becomeMember,LoginMember } = require("../../models/user/Membership.model");

const Joi = require("joi");

const Memberschema = Joi.object().keys({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  phoneNumber: Joi.string()
    .regex(/^(?:\+?\d{10}|\d{1}[0]\d{7,8})$/) // .regex(/^\+\0\d{10,}$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  membershipType: Joi.string()
    .regex(/^[a-zA-Z]+$/)
    .max(40)
    .required(),
  dateOfBirth: Joi.date().iso().max("now").required(),
  userName: Joi.string().alphanum().min(3).max(30).required(),
  CompanyName: Joi.string().alphanum().min(3).max(50).required(),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"
      )
    )
    .required(),
});


const Loginschema = Joi.object().keys({
   
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"
        )
      )
      .required(),
  });

/**
 *
 * @route POST /signupMembers
 * @param {*} req req.body.data
 * @param {*} res
 * @returns msg that member is regestered
 */

exports.signupCustomers = async (req, res) => {
  if (!req.body.data) return res.status(400).send("Bad Request");
  const { error } = Memberschema.validate(req.body.data);

  if (error) {
    res.status(400).send(error.details[0].message);
  } else {
    try {
      const result = await becomeMember(req.body.data);
      if (result) {
        res.status(200).send({ msg: "Sucessfully Regesterd" });
      } else {
        res.status(400).send({ msg: "Error " });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

exports.loginCustomers = async (req, res) => {
    if (!req.body.data) return res.status(400).send("Bad Request");
    const { error } = Loginschema.validate(req.body.data);
  
    if (error) {
      res.status(400).send(error.details[0].message);
    } else {
      try {
        const result = await LoginMember(req.body.data);
        if (result) {
          res.status(200).send({ msg: "Login" });
        } else {
          res.status(400).send({ msg: "Error " });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
