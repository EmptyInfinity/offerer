import { ForbiddenError } from '../handlers/ApiError';
import CompanyService from '../services/CompanyService';

export default class Accessor {
  private static isUserCompanyAdmin = async (companyId: any, userId: any) => CompanyService.isUserCompanyAdmin(companyId, userId);

  private static isUserInCompany = async (companyId: any, userId: any) => CompanyService.isUserInCompany(companyId, userId);

  // companies route
  public static canUserCreateCompany = (isAdmin: boolean) => {
    if (isAdmin) throw new ForbiddenError('Admin can\'t create companies!');
  }

  public static canUserUpdateCompany = async (companyId: any, userId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      if (!await this.isUserCompanyAdmin(companyId, userId)) throw new ForbiddenError();
    }
  }

  public static canUserJoinCompany = async (companyId: any, userId: any) => {
    // look for existing invite
    if (!await this.isUserInCompany(companyId, userId)) throw new ForbiddenError('User already belongs company!');
  }

  public static canUserDeleteCompany = async (companyId: any, userId: any, isAdmin: boolean) => Accessor.canUserUpdateCompany(companyId, userId, isAdmin);

  public static canUserInviteToCompany = async (companyId: any, userId: any) => {
    if (!await this.isUserCompanyAdmin(companyId, userId)) throw new ForbiddenError();
  }

  // users route
  public static canUserCreateUser = (reqUserToken: string) => {
    if (reqUserToken) throw new ForbiddenError('Logined user can\'t create other user!');
  }

  public static canUserGetUser = (reqUserId: any, targetUserId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      if (reqUserId !== targetUserId) {
        throw new ForbiddenError();
      }
    }
  }

  public static canUserGetAllUsers = (isAdmin: boolean) => {
    if (isAdmin) throw new ForbiddenError();
  }

  public static canUserUpdateUser = (reqUserId: any, targetUserId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      if (reqUserId !== targetUserId) {
        throw new ForbiddenError();
      }
    }
  }

  public static canUserDeleteUser = (reqUserId: any, targetUserId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      if (reqUserId !== targetUserId) {
        throw new ForbiddenError();
      }
    }
  }
}
