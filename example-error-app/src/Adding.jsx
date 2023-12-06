import { useState } from "react";
import "./Adding.scss";

const Adding = ({ products }) => {
  const [total, setTotal] = useState(0);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  return (
    <div>
      <div className="total">Total: {total}</div>
      <div className="input-row">
        <select onChange={(e) => setProductName(e.target.value)}>
          <option value="">--Please choose an option--</option>
          {products.map((data) => (
            <option value={data.name}>{data.name}</option>
          ))}
        </select>
        <input
          placeholder="quantity"
          onChange={(e) => setQuantity(+e.target.value)}
        />
        <button
          onClick={() => {
            const product = products.find((v) => v.name === productName);
            const newTotal = total + product.price * quantity;
            setTotal(newTotal);
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Adding;
