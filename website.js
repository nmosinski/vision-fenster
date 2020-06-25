import WixUsers from 'wix-users';

import ShoppingCartRepository from "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartRepository.js"
import ShoppingCartItemRepository from "public/src/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js"
import ProductRepository from "public/src/main/feature/shoppingCart/infrastructure/data/foreignDomains/ProductRepository.js"
import ShoppingCartApplicationService from "public/src/main/feature/shoppingCart/application/ShoppingCartApplicationService.js"

import WixUsersFrontendAuthenticationService from "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersFrontendAuthenticationService.js"

WixUsers.onLogin( async function(user){
    let shoppingCartApplicationService = new ShoppingCartApplicationService(new ShoppingCartRepository(), new ShoppingCartItemRepository(), new ProductRepository(), new WixUsersFrontendAuthenticationService());
    await shoppingCartApplicationService.createShoppingCartForCurrentUserIfDoesntExist();
} );
