import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import { getUserByEmail, registerUser } from "../persistance/daos/mongodb/userDaoMongo.js";
import 'dotenv/config'
import { loginUserServices } from "../services/userServices.js";
import { HttpResponse } from "../utils/http.response.js"
const httpResponse = new HttpResponse();
import error from "../utils/errors.dictionary.js";


const strategyOptions = {
  clientID: process.env.GITHUB_STRATEGY_CLIENT_ID,
  clientSecret: process.env.GITHUB_STRATEGY_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_STRATEGY_CALLBACK_URL,
  passReqToCallback: true,
  scope: "user:email"
};

const registerOrLogin = async ( accessToken, refreshToken, profile, done ) => {
  //console.log("profile", profile);
  //console.log('email:', profile.emails[0].value);

  //console.log('github', req.cookies);
  
  const email = profile.emails[0].value;
  const password = profile._json.node_id

  const user = await getUserByEmail(email);

  // console.log('req.cookies =', req.cookies);
  // console.log('accessToken', accessToken);
  // console.log('refreshToken ', refreshToken);
  // console.log('user', user);
  // console.log('email:', email);
  // console.log('password:', password);
  
  const first_name = profile._json.name
    ? profile._json.name
    : profile._json.login;

  
  if (!email) return done(null, false);

  if (user) {

    const token = await loginUserServices({email, password});
  
      if (!token) return httpResponse.Unauthorized(res, error.USER_CREDENTIALS)
  
      //console.log('token (if user): 3333' + token);

      //req.cookie('token', token, { httpOnly: true });
      //res.cookie('token', token, { httpOnly: true });
      
      return done(null, user);
  } 
  

  const newUser = await registerUser({
    first_name: first_name,
    last_name: " ",
    email,
    password: profile._json.node_id,
    isGithub: true,
  });

 return done(null, newUser);
};

passport.use("github", new GithubStrategy(strategyOptions, registerOrLogin));