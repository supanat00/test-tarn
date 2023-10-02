const express = require("express");
const router = express.Router();
let fs = require("fs");
let dayjs = require("dayjs");
let dayFormat = "DD/MM/YYYY";
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let formidable = require("formidable");
const { error } = require("console");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const isLogin = require("../middleware/redirectifAuth");
const authMiddleware = require("../middleware/authMiddleware");

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://sahasawattee:Daw7lY3UGeHNP4kg@cluster0.ozsrvon.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("connection sucessfully"))
  .catch((err) => console.error(err));

router.get("/register", isLogin, function (req, res, next) {
  let data = req.flash("data")[0];
  let username = "";
  let password = "";
  let confirm_password = "";
  let role = "";
  let company_name = "";
  let name = "";
  let surname = "";
  let email = "";
  let phone = "";
  let identification_number = "";
  let line_id = "";
  let address = "";
  let district = "";
  let subdistrict = "";
  let province = "";
  let postal_code = "";
  if (typeof data != "undefined") {
    username = data.username;
    password = data.password;
    confirm_password = data.confirm_password;
    role = data.role;
    company_name = data.company_name;
    name = data.name;
    surname = data.surname;
    email = data.email;
    phone = data.phone;
    identification_number = data.identification_number;
    line_id = data.line_id;
    address = data.address;
    district = data.district;
    subdistrict = data.subdistrict;
    province = data.province;
    postal_code = data.postal_code;
  }
  res.render("register", {
    errors: req.flash("validationErrors"),
    username: username,
    password: password,
    confirm_password: confirm_password,
    role: role,
    company_name: company_name,
    name: name,
    surname: surname,
    email: email,
    phone: phone,
    identification_number: identification_number,
    line_id: line_id,
    address: address,
    district: district,
    subdistrict: subdistrict,
    province: province,
    postal_code: postal_code,
  });
});

router.post("/register", async (req, res) => {
  let form = new formidable.IncomingForm();
  console.log(req.body);
  form.parse(req, async (err, fields, files) => {
    if (files.bank_number) {
      let filePath_pass;
      let newpath_pass;
      let filepath_bank = files.bank_number[0].filepath;
      let newPath_bank =
        "C://Users/Legion/Documents/Atlux168/secret_images/book_bank/";
      newPath_bank += files.bank_number[0].originalFilename;
      if (files.card_number) {
        files.company_file = null;
        let filePath_card = files.card_number[0].filepath;
        let newPath_card =
          "C://Users/Legion/Documents/Atlux168/secret_images/card_number/";
        newPath_card += files.card_number[0].originalFilename;
        filePath_pass = filePath_card;
        newpath_pass = newPath_card;
      } else {
        files.card_number = null;
        let filepath_company_file = files.company_file[0].filepath;
        let newPath_company_file =
          "C://Users/Legion/Documents/Atlux168/secret_images/company_file/";
        newPath_company_file += files.company_file[0].originalFilename;
        filePath_pass = filepath_company_file;
        newpath_pass = newPath_company_file;
      }
      console.log(filePath_pass);
      if (filePath_pass === undefined) return res.redirect("/auth/register");
      if (fields["password"][0] == fields["confirm_password"][0]) {
        fs.copyFile(filepath_bank, newPath_bank, () => {
          fs.copyFile(filePath_pass, newpath_pass, () => {
            User.create({
              username: fields["username"][0],
              password: fields["password"][0],
              role: fields["role"][0],
              company_name: fields["company_name"][0],
              name: fields["name"][0],
              surname: fields["surname"][0],
              email: fields["email"][0],
              phone: fields["phone"][0],
              identification_number: fields["identification_number"][0],
              line_id: fields["line_id"][0],
              address: fields["address"][0],
              district: fields["district"][0],
              subdistrict: fields["subdistrict"][0],
              province: fields["province"][0],
              postal_code: fields["postal_code"][0],
              card_number: files.card_number
                ? files.card_number[0].originalFilename
                : null,
              bank_number: files.bank_number[0].originalFilename,
              company_file: files.company_file
                ? files.company_file[0].originalFilename
                : null,
            })
              .then(() => {
                res.redirect("/");
              })
              .catch((error) => {
                if (error) {
                  const validationErrors = Object.keys(error.errors).map(
                    (key) => error.errors[key].message
                  );
                  req.flash("validationErrors", validationErrors);
                  req.flash("data", fields);
                  return res.redirect("/auth/register");
                }
              });
          });
        });
      } else {
        console.log("password not match");
        req.flash("data", fields);
        res.redirect("/auth/register");
      }
    } else {
      console.log("not found file");
      res.redirect("/auth/register");
    }
  });
});

router.post("/login", isLogin, (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((user) => {
    if (user) {
      let cmp = bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          req.session.userId = user._id;
          req.session.role = user.role;
          res.redirect("/auth/home");
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  });
});

router.get("/home", authMiddleware, (req, res) => {
  res.render("home");
});
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
module.exports = router;
