import { ForbiddenError, NotFoundError } from '../handlers/ApiError';
import CompanyService from '../services/CompanyService';
import UserService from '../services/UserService';
import OfferService from '../services/OfferService';

export default class Accessor {
  // companies route
  public static canUserCreateCompany = (isAdmin: boolean) => {
    if (isAdmin) throw new ForbiddenError('Admin can\'t create companies!');
  }

  public static canUserUpdateCompany = async (companyId: any, userId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      const isCompanyAdmin = await CompanyService.isUserCompanyAdmin(companyId, userId);
      if (!isCompanyAdmin) {
        if (await CompanyService.isExists(companyId)) {
          throw new ForbiddenError();
        }
        throw new NotFoundError(`Company with id "${companyId}" is not found!`);
      }
    }
  }

  public static canUserDeleteCompany = async (companyId: any, userId: any, isAdmin: boolean) => this.canUserUpdateCompany(companyId, userId, isAdmin);

  // users route
  public static canUserCreateUser = (reqUserToken: string) => {
    if (reqUserToken) throw new ForbiddenError('Logined user can\'t create other user!');
  }

  public static canUserGetUser = async (reqUserId: any, targetUserId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      if (reqUserId !== targetUserId) {
        if (await UserService.isExists(targetUserId)) {
          throw new ForbiddenError();
        }
        throw new NotFoundError(`User with id "${targetUserId}" is not found!`);
      }
    }
  }

  public static canUserGetAllUsers = (isAdmin: boolean) => {
    if (isAdmin) throw new ForbiddenError();
  }

  public static canUserUpdateUser = async (reqUserId: any, targetUserId: any, isAdmin: boolean) => this.canUserGetUser(reqUserId, targetUserId, isAdmin);

  public static canUserDeleteUser = async (reqUserId: any, targetUserId: any, isAdmin: boolean) => this.canUserGetUser(reqUserId, targetUserId, isAdmin);

  // offers route
  public static canUserCreateOffer = async (userId: any, companyId: any) => {
    const isCompanyAdmin = await CompanyService.isUserCompanyAdmin(companyId, userId);
    if (!isCompanyAdmin) {
      if (await CompanyService.isExists(companyId)) {
        throw new ForbiddenError();
      }
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
  }

  public static canUserUpdateOffer = async (userId: any, companyId: any, isAdmin: boolean) => {
    if (!isAdmin) {
      const isCompanyAdmin = await CompanyService.isUserCompanyAdmin(companyId, userId);
      if (!isCompanyAdmin) {
        if (await CompanyService.isExists(companyId)) {
          throw new ForbiddenError();
        }
        throw new NotFoundError(`Company with id "${companyId}" is not found!`);
      }
    }
  }

  public static canUserDeleteOffer = async (userId: any, companyId: any, isAdmin: boolean) => this.canUserUpdateOffer(userId, companyId, isAdmin);

  // invites route
  public static canUserInviteUserToCompanyByOffer = async (reqUserId: any, targetUserId: any, companyId: any, offerId: any) => {
    const isCompanyAdmin = await CompanyService.isUserCompanyAdmin(companyId, reqUserId);
    if (!isCompanyAdmin) {
      if (await CompanyService.isExists(companyId)) {
        throw new ForbiddenError();
      }
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
    if (!await UserService.isExists(targetUserId)) {
      throw new NotFoundError(`User with id "${targetUserId}" is not found!`);
    }
    if (await CompanyService.isUserInCompany(companyId, targetUserId)) throw new ForbiddenError('User already belongs company!');
    if (!await OfferService.isExists(offerId)) {
      throw new NotFoundError(`Offer with id "${offerId}" is not found!`);
    }
  }

  public static canUserJoinCompanyByOffer = async (userId: any, companyId: any, offerId: any) => {
    if (await CompanyService.isUserInCompany(companyId, userId)) throw new ForbiddenError('User already belongs company!');
    if (!await CompanyService.isExists(companyId)) {
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
    if (!await OfferService.isExists(offerId)) {
      throw new NotFoundError(`Offer with id "${offerId}" is not found!`);
    }
  }
}
