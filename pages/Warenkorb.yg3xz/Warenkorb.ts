import WixUsers from "../../public/main/common/authenticationService/wixUsers/wix-users"
import wixWindow from "wix-window"
import WixLocation from "wix-location"

import ShoppingCartRepository from "public/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartRepository.js"
import ShoppingCartItemRepository from "public/main/feature/shoppingCart/infrastructure/data/wixData/WixDataShoppingCartItemRepository.js"
import ProductRepository from "public/main/feature/shoppingCart/infrastructure/data/foreignDomains/ProductRepository.js"
import ShoppingCartApplicationService from "../../public/main/feature/shoppingCart/controllers/ShoppingCartApplicationService.js"

import WixUsersFrontendAuthenticationService from "../../public/main/common/authenticationService/wixUsers/WixUsersFrontendAuthenticationService.js"

var shoppingCartApplicationService;
var shoppingCartRepository;
var shoppingCart;

$w.onReady(async function () 
{
    shoppingCartRepository = new ShoppingCartRepository();
    shoppingCartApplicationService = new ShoppingCartApplicationService(shoppingCartRepository, new ShoppingCartItemRepository(), new ProductRepository(), new WixUsersFrontendAuthenticationService());

    shoppingCart = await shoppingCartRepository.getShoppingCartByUserId(WixUsers.currentUser.id);
    initRepeater();
});

async function updateShoppingCart()
{
    await shoppingCartApplicationService.updateCurrentUsersShoppingCart(shoppingCart);
}

function updateRepeater()
{
    let toUpdate = [];
    shoppingCart.items.foreach((item)=>{toUpdate.push(item.id);});
    $w("#repeaterShoppingCartItems").data = shoppingCart.items.toArray();
    $w("#repeaterShoppingCartItems").forItems(toUpdate, onItemReadyFunctionForRepeater);
}

function initRepeater()
{
    $w("#repeaterShoppingCartItems").onItemReady(onItemReadyFunctionForRepeater);
    $w("#repeaterShoppingCartItems").data = shoppingCart.items.toArray();
}

function onShoppingCartChange()
{
    updateRepeater();
}

async function onPageLeave()
{
    await updateShoppingCart();
}


function onItemReadyFunctionForRepeater($item, shoppingCartItem, index)
{
    $item("#imageShoppingCartItem").src = shoppingCartItem.image;
        $item("#textShoppingCartItemTitle").text = "Fenster";
        $item("#textShoppingCartItemDetails").text = shoppingCartItem.details;
        $item("#textShoppingCartItemSinglePrice").text = "" + shoppingCartItem.singlePrice;
        $item("#textShoppingCartItemTotalPrice").text = "" + shoppingCartItem.totalPrice;
        $item("#dropdownShoppingCartItemCount").value = "" + shoppingCartItem.count;

        $item('#dropdownShoppingCartItemCount').onChange((event)=>{
            shoppingCart.setCountOfItem(shoppingCartItem.id, parseInt(event.target.value, 10));
            onShoppingCartChange();
        });
        $item("#buttonShoppingCartItemRemove").onClick((event)=>{
            shoppingCart.removeItem(shoppingCartItem.id);
            console.log(shoppingCart);
            onShoppingCartChange();
        });
        $item("#buttonShoppingCartItemEdit").onClick(async function(event){
            await onPageLeave();
            WixLocation.to("/fensterkonfigurator?id=" + shoppingCartItem.productId);
            //LeavePage
        });
}

export async function buttonToCheckoutOnClick(event) 
{
    await onPageLeave();
    // Leave page.
}



















/*
import wixLocation from 'wix-location'
import {GetAllProducts, SetActProductId, DeleteProduct, checkoutNewProduct, initConfigurator} from 'public/new/frontendBridge.js'

var TABLE_BESCHREIBUNG_COL_NAME = "property";

$w.onReady(function () 
{
    setupRepeater();
});

function setupRepeater()
{
    let tmpData = [{_id: "2"}, {_id: "3"}];
    const repeaterData = tmpData;
        
    //setup repeater
    $w('#repeaterProdukt').onItemReady(($item, itemData, index) =>{
        //setup table
        const beschreibungRows = Object.values(beschribungFromData(itemData.properties));
        let propertyCol = $item('#tableBeschreibung').columns[0];
        propertyCol.label = TABLE_BESCHREIBUNG_COL_NAME;
        propertyCol.dataPath = TABLE_BESCHREIBUNG_COL_NAME;
        $item('#tableBeschreibung').columns = [propertyCol];
        $item('#tableBeschreibung').rows = beschreibungRows;

        $item('#textProdukt').text = "Fenster";

        //$item('imageProdukt').src = "https://static.wixstatic.com/media/6a4add_15f855af7e704857876c243f7fd63030~mv2.jpg/v1/fill/w_220,h_220/material-kunststoff.jpg";
        
        $item('#textEinzelpreis').text = "5";
        $item('#textGesamtpreis').text = "5";
        $item('#dropdownAnzahl').onChange(()=>{
            let einzelpreisTxt = $item('#textEinzelpreis').text.toString();
            let einzelpreisInt = parseInt(einzelpreisTxt, 10);
            let anzahl = $item('#dropdownAnzahl').value;
            let anzahlInt = parseInt(anzahl, 10)
            $item('#textGesamtpreis').text = "" + (einzelpreisInt * anzahlInt);
        });

        $item('#buttonBearbeiten').onClick(()=>{
            SetActProductId(itemData.id);
            wixLocation.to("/material");
        });

        $item('#buttonEntfernen').onClick(()=>{
            DeleteProduct(itemData.id);
            setupRepeater();
        });
        $item('#buttonHideElement').onClick(()=>{
            if($item('#textGesamtpreis').collapsed)
                $item('#textGesamtpreis').expand();
            else
                $item('#textGesamtpreis').collapse();
        });
    });

    $w('#repeaterProdukt').data = repeaterData;
}


function beschribungFromData(data)
{
    let ret = {};

    for(const key in data)
    {
        let prop = data[key];
        let el = {};
        el[TABLE_BESCHREIBUNG_COL_NAME] = prop.propName + ": " + prop.title;
        ret[key] = el;
    }
    return ret;
}

export function buttonNeuesProdukt_click(event) 
{
    checkoutNewProduct();
    wixLocation.to("/Konfigurationsprodukt");
}

export function buttonHideShow_click(event) 
{
    if(!$w('#container').collapsed)
        $w('#container').collapse();
    else
        $w('#container').expand();
}
*/

