import ImportOverview from "./contai/ImportOverview";
import ProductsOverview from "./contai/ProductsOverview";
import ProductsStockWarnings from "./contai/ProductsStockWarnings";

const StatisticalProductsAndImports = () => {
  return (
    <div>
      <ProductsOverview />
      <ProductsStockWarnings />
      <ImportOverview />
    </div>
  );
};
export default StatisticalProductsAndImports;
