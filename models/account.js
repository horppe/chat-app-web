import mongoose, { SchemaTypes } from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';
import UUIDV4 from 'uuid/v4';

const Account = new Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  online: Boolean,
  contacts: {
    type: [{type: SchemaTypes.ObjectId, ref: 'accounts'}],
    
  },
  sockets:[String],
  token: SchemaTypes.String,
  conversations: [
    {
      type: SchemaTypes.ObjectId,
      ref: 'messages'
    }
  ]
}, {
  timestamps: true
});

Account.plugin(passportLocalMongoose);

export default mongoose.model('accounts', Account);
