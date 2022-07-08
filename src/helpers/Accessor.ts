import { Request } from 'express';
import { IUser } from '../databases/interfaces';
import { USER_ROLE } from '../config';
import { ForbiddenError } from '../handlers/ApiError';

export default class Accessor {
  public static canUserCreateCompany = (req: Request) => {
    if (req.user.role === USER_ROLE.admin) {
      throw new ForbiddenError('"admin" can\'t create companies!');
    }
  }

  public static canUserUpdateCompany = (req: Request) => {
    if (
      !Accessor.isUserCompanyAdmin(req.user) || req.user.role !== USER_ROLE.admin
    ) {
      throw new ForbiddenError();
    }
  }

  public static canUserJoinCompany = (req: Request) => {
    if (req.user.company) { // probably it should not be here
      throw new ForbiddenError('User already belongs company!');
    }
  }

  public static canUserLeaveCompany = (req: Request) => {
    if (!req.user.company) { // probably it should not be here
      throw new ForbiddenError('User does not belongs any company!');
    }
  }

  public static canUserDeleteCompany = (req: Request) => Accessor.canUserUpdateCompany(req);

  public static canUserInviteToCompany = (req: Request) => Accessor.canUserUpdateCompany(req);

  private static isUserCompanyAdmin = (user: IUser) => user.role === USER_ROLE.admin;

  // I don't think that validation here should be more complex. But it can take a place (depends on app)
  private static isUserBelongsCompany = (userCompanyId: string, companyId: string) => userCompanyId == companyId;
}
