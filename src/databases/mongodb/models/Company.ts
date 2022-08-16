import { model, Schema, Document } from 'mongoose';
import { ICompany } from '../../interfaces';

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

// @ts-ignore
if (!schema.options.toObject) schema.options.toObject = {};
// @ts-ignore
schema.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id.toString();
  ret.employees.forEach((empl: any) => {
    empl.user = `${empl.user}`;
  });
  delete ret._id;
  return ret;
};

export const CompanyModel = model<CompanyDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
