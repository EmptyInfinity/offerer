import { Request } from 'express';
import { USER_ROLE } from '../config';
import { ForbiddenError } from '../handlers/ApiError';
import CompanyService from '../services/CompanyService';

export default class Accessor {
  private static isUserCompanyAdmin = async (req: Request) => {
    const companyId = req.params.id;
    const userId = req.user.id;
    return CompanyService.isUserCompanyAdmin(companyId, userId);
  }

  private static isUserInCompany = async (req: Request) => {
    const companyId = req.params.id;
    const userId = req.user.id;
    return CompanyService.isUserInCompany(companyId, userId);
  }

  public static canUserCreateCompany = (req: Request) => {
    if (req.user.role === USER_ROLE.admin) {
      throw new ForbiddenError('"admin" can\'t create companies!');
    }
  }

  public static canUserUpdateCompany = async (req: Request) => {
    if (req.user.role !== USER_ROLE.admin) {
      if (!await this.isUserCompanyAdmin(req)) throw new ForbiddenError();
    }
  }

  public static canUserJoinCompany = async (req: Request) => {
    // look for existing invite
    if (!await this.isUserInCompany(req)) throw new ForbiddenError('User already belongs company!');
  }

  public static canUserDeleteCompany = async (req: Request) => Accessor.canUserUpdateCompany(req);

  public static canUserInviteToCompany = async (req: Request) => {
    if (!await this.isUserCompanyAdmin(req)) throw new ForbiddenError();
  }

  // users route

  public static canUserGetAllUsers = (req: Request) => {
    if (req.user.role !== USER_ROLE.admin) throw new ForbiddenError();
  }

  public static canUserUpdateUser = (req: Request) => {
    if (req.user.id !== req.params.id) throw new ForbiddenError();
  }

  public static canUserDeleteUser = (req: Request) => {
    if (req.user.role !== USER_ROLE.admin) {
      if (req.user.id !== req.params.id) throw new ForbiddenError();
    }
  }
}
