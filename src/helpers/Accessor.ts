import { Request } from 'express';
import { IUser } from '../databases/interfaces';
import { USER_ROLE } from '../config';
import { ForbiddenError } from '../handlers/ApiError';

export default class Accessor {
  public static canUserCreateCompany = (req: Request) => {
    if (req.user.role === USER_ROLE.companyAdmin) {
      throw new ForbiddenError('User can be admin of only one company!');
    }
  }

  public static canUserUpdateCompany = (req: Request) => {
    if (
      !Accessor.isUserCompanyAdmin(req.user) ||
      !Accessor.isUserBelongsCompany(req.user.company, req.params.id)
    ) {
      throw new ForbiddenError();
    }
  }

  public static canUserJoinCompany = (req: Request) => {
    if (req.user.company) {
      throw new ForbiddenError();
    }
  }

  public static canUserLeaveCompany = (req: Request) => {
    if (!req.user.company) {
      throw new ForbiddenError();
    }
  }

  public static canUserDeleteCompany = (req: Request) => Accessor.canUserUpdateCompany(req);

  public static canUserInviteToCompany = (req: Request) => Accessor.canUserUpdateCompany(req);

  private static isUserCompanyAdmin = (user: IUser) => user.role === USER_ROLE.companyAdmin;

  private static isUserBelongsCompany = (userId: string, companyId: string) => userId == companyId;
}
