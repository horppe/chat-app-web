import express from 'express';
import Account from '../models/account';
import passport from 'passport';
import guard from 'connect-ensure-login';

const router = express.Router();

/* GET users listing. */
router.get('/',guard.ensureLoggedIn() , function(req, res, next) {
  console.log("In chat Contacts Index")
  //console.log(req.user, "User")
  
  res.render('index', {layout: 'layouts/user', token: req.user.token})
});
router.get('/chat', guard.ensureLoggedIn(), function(req, res, next) {
  console.log(req.user, "User object from Passport")
  res.render('chat')
});
router.post('/search', guard.ensureLoggedIn(), async function(req, res){
  console.log(req.body, "In route")
  let params = req.body.searchParam;
  if(!params || params === '' ){ //throw new Error("Nothing in the search parameter")
    return res.json({friends: [], error: "No value in search"});  
  }
  params = params.split(' ');
  let matchesMap = {};
  for(let i = 0; i < params.length; i++){
    let matches = await Account.find({ name: new RegExp(params[i], "i")});
    
    //console.log(matches, "Matches")
    matches.forEach(function(contact, index){
      matchesMap[contact._id] = contact;
    })
  }
  let result = [];
  for(let match in matchesMap){
    result.push(matchesMap[match])
  }
  
  res.json(result);
});

router.post('/add', guard.ensureLoggedIn(), async (req, res, next) => {
  console.log("In Route")
  var user = await Account.findById(req.user._id);
  var contact = await Account.findById(req.body.id);
  user.contacts.push(contact._id);
  try{
    await user.save();
  } catch(err){
    console.log(err);
    next(err)
  }
  console.log("Express flash test", req.expressFlash)
  res.json({message: "Friend Added!!"})
})

export default router;
