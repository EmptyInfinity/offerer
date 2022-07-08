Top level entities: Users & Companies.
Additional entities: Invites & Offers

User role can be: user or admin.
User can create any amount of companies he wants.
User has role between companies: guest, worker or admin.
Company admin can create offers and invite users to join the company by it's offer.
And vise verse any user can ask company to apply him by offer. 

invite: {
    invite: company || user
    companyId
    userId
}