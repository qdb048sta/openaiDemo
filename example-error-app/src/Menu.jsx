import { useState } from "react";
import "./Menu.scss";
import ProductModal from "./ProductModal";

const Menu = ({ products, setProducts }) => {
  const [isOpen, setIsOpen] = useState(false);
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
              <td>{data.name}</td>
              <td>${data.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Product
      </button>
      <ProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        products={products}
        setProducts={setProducts}
      />
    </div>
  );
};

export default Menu;
