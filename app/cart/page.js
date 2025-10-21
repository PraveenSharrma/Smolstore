"use client";

import { useProducts } from "@/context/ProductContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, handleIncrementProduct } = useProducts();

  // 🧮 Calculate the total cost of items in the cart
  const total = Object.keys(cart).reduce((acc, curr) => {
    const cartItem = cart[curr];
    const quantity = cartItem.quantity;
    const cost = cartItem.prices[0].unit_amount;
    return acc + cost * quantity;
  }, 0);

  // 🧾 Create Stripe Checkout session
  async function createCheckout() {
    try {
      const lineItems = Object.keys(cart).map((item) => ({
        price: item,
        quantity: cart[item].quantity,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ lineItems }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        router.push(data.url);
      } else {
        console.error("Failed to create checkout session", data);
      }
    } catch (err) {
      console.error("Error creating checkout:", err.message);
    }
  }

  return (
    <section className="cart-section">
      <h2>Your Cart</h2>

      {Object.keys(cart).length === 0 && <p>You have no items in your cart!</p>}

      <div className="cart-container">
        {Object.keys(cart).map((item, index) => {
          const itemData = cart[item];
          const itemQuantity = itemData?.quantity;

          const imgName =
            itemData.name === "Medieval Dragon Month Planner"
              ? "planner"
              : itemData.name
                  .replaceAll(" Sticker.png", "")
                  .replaceAll(" ", "_");

          const imgUrl = "low_res/" + imgName + ".jpeg";

          return (
            <div key={index} className="cart-item">
              <img src={imgUrl} alt={imgName + "-img"} />
              <div className="cart-item-info">
                <h3>{itemData.name}</h3>
                <p>
                  {itemData.description.slice(0, 100)}
                  {itemData.description.length > 100 ? "..." : ""}{" "}
                </p>
                <h4>${itemData.prices[0].unit_amount / 100}</h4>
                <div className="quantity-container">
                  <p>
                    <strong>Quantity</strong>
                  </p>
                  <input
                    type="number"
                    value={itemQuantity}
                    placeholder="2"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleIncrementProduct(
                        itemData.default_price,
                        newValue,
                        itemData,
                        true
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="checkout-container">
        <Link href={"/"}>
          <button>&larr; Continue shopping</button>
        </Link>
        <button onClick={createCheckout}>Checkout &rarr;</button>
      </div>
    </section>
  );
}
