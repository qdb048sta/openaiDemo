import { useState } from "react";
import defaultProducts from "./products";
import Adding from "./Adding";
import Menu from "./Menu";
import "./App.css";

function App() {
  const [products, setProducts] = useState(defaultProducts);
  return (
    <>
      <Menu products={products} setProducts={setProducts} />
      <Adding products={products} />
    </>
  );
}

export default App;
