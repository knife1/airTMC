const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {
  _StaticUrl
} = require('./config/path');
const authorize = require('./middlewares/auth');
const indexRouter = require("./controllers/routers");
const httpHelper = require('./helpers/httpHelper')();
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
// 半个小时无操作，session消失
app.use(
  session({
    secret: "airTMCKey", //值可以随便取
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30
    },
    rolling: true //只要页面由刷新，session值就会被保存，如果为false则只要半小时以后不管有没有操作，session都会消失
  })
);
// 获取token
app.use(async function (req, res, next) {
  if (req.query.token) {
    res.cookie("token", req.query.token, {
      maxAge: 1000 * 60 * 20
    });
    await httpHelper.get(req, res, '', `/tokenInnerApi/getFullUserInfoByToken?token=${req.query.token}`, "userInfo").then(function (data) {
      let result = JSON.parse(data);
      if (result.code===0) {
          req.session.staffInfo = result.data;
      } else {
          res.status(403).send('Forbidden')
      }
    }, function (error) {
        res.status(403).send('Forbidden')
    });
  }
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use(authorize);

app.use("/", indexRouter);

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

hbs.registerHelper({
  section: function (name, block) {
    if (!this._sections) {
      this._sections = {};
    }
    this._sections[name] = block.fn(this);
    return null;
  },
  static: function (name) {
    let baseUrl = _StaticUrl || "";
    return baseUrl + name;
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;