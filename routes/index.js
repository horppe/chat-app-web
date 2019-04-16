import express from 'express';
import passport from 'passport';
import Account from '../models/account';
import guard from 'connect-ensure-login';
import jwt from 'jsonwebtoken';
import Config from '../config/config';
const router = express.Router();



router.get('/',  (req, res) => {
  
    res.redirect('/login');
   // res.render('index', { user: req.user, layout: 'layouts/user' });
  }
);

// router.get('/home', (req, res) => {
 
//   res.render('index', { user: req.user, layout: 'layouts/user' });
// });

router.get('/register', (req, res) => {
  res.render('register', { layout: 'layouts/guest' });
});

router.post('/register', (req, res, next) => {
  Account.register(new Account({ username: req.body.username , name: req.body.name, email: req.body.email}),
                   req.body.password, async (err, account) => {
                     if (err) {
                       return res.render('register', { error: err.message });
                     }
                     console.log('In Register')
                     account.token = jwt.sign({ id: account._id }, Config.JWT_SECRET);
                     await account.save();
                     passport.authenticate('local')(req, res, () => {
                       req.session.save((err) => {
                         if (err) {
                           return next(err);
                         }
                         res.redirect('/users/chat');
                       });
                     });
                    });
});


router.get('/login', (req, res) => {
  res.render('login', { /* layout: 'layout', */user: req.user,
                                               error: req.flash('error'),
                                               layout: 'layouts/guest' });
});

router.post('/login', passport.authenticate('local',
                                            { failureRedirect: '/login',
                                              failureFlash: true }),
            (req, res, next) => {
              console.log("Succesfull Login")
              req.session.save((err) => {
                if (err) {
                  return next(err);
                }
                res.redirect('/users/search')
              });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

router.get('/ping', (req, res) => {
  res.status(200).send('pong!');
});

export default router;
