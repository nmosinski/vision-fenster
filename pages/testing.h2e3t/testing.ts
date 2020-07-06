import ShoppingCart from "public/main/feature/shoppingCart/model/ShoppingCart.js"
//@ts-ignore
$w.onReady(async function () {
    let shoppingCart = new ShoppingCart();
    shoppingCart.id = "anewshoppingcart";
    await shoppingCart.save();
    console.log("hellooo");
});
