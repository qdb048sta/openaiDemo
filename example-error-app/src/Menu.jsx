import { useState } from "react";
import "./Menu.scss";
import defaultProducts from "./products";

const Menu = () => {
  const [products, setProduct] = useState(defaultProducts);
  return (
    <div className="menu">
      <table>
        <thead>
          <tr>
            <th>product</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((data) => (
            <tr>
              <td>{data.name}: </td>
              <td>${data.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button>Add Product</button>
    </div>
  );
};

export default Menu;
