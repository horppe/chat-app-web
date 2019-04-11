import mongoose, { SchemaTypes } from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const Account = new Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  online: Boolean,
  contacts: [SchemaTypes.ObjectId],
  sockets:[String],
  token: SchemaTypes.String,
  conversations: [
    {
      type: Object,
      _id: { type: String, required: true },
      contactId:{ type: SchemaTypes.ObjectId, required: true },
      createdAt: SchemaTypes.Date,
      
      messages: [
        {
          _id: { type: SchemaTypes.ObjectId, required: true },
          messageType: {
            type: String,
            enum: ['me', 'contact'],
            default: 'me'
          },
          body: String,
          createdAt: SchemaTypes.Date
        }
      ]
    }
  ]
});

Account.plugin(passportLocalMongoose);

export default mongoose.model('accounts', Account);
