import { model, Schema, Document } from 'mongoose';
import { ICompany } from '../../interfaces';
import { capitalize } from '../../../helpers';
import { DBDuplicatedFieldError } from '../../common';

export const DOCUMENT_NAME = 'Company';
export const COLLECTION_NAME = 'companies';
export interface CompanyDocument extends ICompany, Document { }

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    link: {
      type: Schema.Types.String,
      unique: true,
      maxlength: 100,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 500,
    },
    employees: [{
      isAdmin: {
        type: Schema.Types.Boolean,
        default: false,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      _id: false,
    }],
  },
  {
    versionKey: false,
  },
);

schema.post('findOneAndUpdate', (error: any, _company: any, next: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const duplicatedField = Object.keys(error.keyPattern)[0];
    next(new DBDuplicatedFieldError(`${capitalize(duplicatedField)} "${error.keyValue[duplicatedField]}" is already in use!`));
  } else {
    next();
  }
});

schema.post('save', (error: any, company: any, next: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    const duplicatedField = Object.keys(error.keyPattern)[0];
    next(new DBDuplicatedFieldError(`${capitalize(duplicatedField)} "${company[duplicatedField]}" is already in use!`));
  } else {
    next();
  }
});

// @ts-ignore
if (!schema.options.toObject) schema.options.toObject = {};
// @ts-ignore
schema.options.toObject.transform = function (doc, obj, options) {
  obj.id = obj._id.toString();
  obj.employees.forEach((empl: any) => {
    empl.user = `${empl.user}`;
  });
  delete obj._id;
  return obj;
};

export const CompanyModel = model<CompanyDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
