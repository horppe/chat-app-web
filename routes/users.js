import express from 'express';
import Account from '../models/account';
import passport from 'passport';
import guard from 'connect-ensure-login';
import Conversation from '../models/conversation';
import Message from '../models/message';

const router = express.Router();

function sortConversationsModified(conversations){
  return conversations.sort((conv1, conv2) => new Date(conv1.modifiedAt) - new Date(conv2.modifiedAt))
}

async function getUsersInConversations(conversations){
  for( let i = 0; i < conversations.length; i++){
    conversations[i].contact = await Account.findById(conversations[i].contactId);
  }

  return conversations;
}

async function getSingleUserInConversation(conversation){
  conversation.contact = await Account.findById(conversation.contactId);

  return conversation;
}

/* GET users listing. */
router.get('/search',guard.ensureLoggedIn() , function(req, res, next) {
  console.log("In chat Contacts Index")
  //console.log(req.user, "User")
  
  res.render('search', {layout: 'layouts/user', token: req.user.token})
});


router.get('/chat', guard.ensureLoggedIn(), async function(req, res, next) {
  let user = req.user;
  let conversations = await Conversation.find()
  let currentConversation = await Conversation.find
  let otherConversations;
  if(user.conversations.length > 0){
    console.log('User has Conversations');
    currentConversation = sortConversationsModified(user.conversations)[0];
                             
    currentConversation = await getSingleUserInConversation(currentConversation);

    otherConversations = req.user.conversations.filter(conv => conv._id !== currentConversation._id);
    otherConversations = await getUsersInConversations(otherConversations);
    otherConversations = sortConversationsModified(otherConversations);
  } else {
    console.log("User has no active conversation")
    currentConversation = null;
    otherConversations = null;
  }
  
  res.render('chat', {layout: 'layouts/user', user: user, otherConversations, currentConversation})
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
  let user = await Account.findById(req.user._id);
  let contact = await Account.findById(req.body.id);

  // Check if user already knows the contact
  // Get existing contact matches in the user contacts Array
  let matches = user.contacts.filter(function(contactId){return contactId == req.body.id}).length;

  if(matches >= 1){
    return next(new Error("Contact already exists in User Contacts Array"))
  } else {
    user.contacts.push(contact._id);
  }
  try{
    await user.save();
  } catch(err){
    console.log(err);
   return next(err)
  }
  console.log("Express flash test", req.expressFlash)
  res.json({message: "Friend Added!!"})
})

router.get('/contacts', guard.ensureLoggedIn(), async (req, res) => {

  let contacts = [];
  let contactIds = req.user.contacts;
  for(let i = 0; i < contactIds.length; i++){
    let contact = await Account.findById(contactIds[i]);
    contacts.push(contact);
  }
  
  res.render('contacts', {layout: 'layouts/user', contacts: contacts})
})

export default router;
