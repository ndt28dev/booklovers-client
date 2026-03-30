import ImportOverview from "./contai/ImportOverview";
import ProductsBestWorst from "./contai/ProductsBestWorst";
import ProductsOverview from "./contai/ProductsOverview";
import ProductsStockWarnings from "./contai/ProductsStockWarnings";

const StatisticalProductsAndImports = () => {
  return (
    <div>
      <ProductsOverview />
      <ProductsStockWarnings />
      <ImportOverview />
      <ProductsBestWorst />
    </div>
  );
};
export default StatisticalProductsAndImports;
