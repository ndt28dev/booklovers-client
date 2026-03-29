import RevenueOverview from "./contai/RevenueOverview";
import OrderStatusOverview from "./contai/OrderStatusOverview";
import RevenueGrowth from "./contai/RevenueGrowth";
import RevenueByCategory from "./contai/RevenueByCategory";
import RevenueOfTheDay from "./contai/RevenueOfTheDay";
import TopOrderByYear from "./contai/TopOrderByYear";

const StatisticalSales = () => {
  return (
    <div>
      <RevenueOverview />
      <RevenueOfTheDay />
      <RevenueGrowth />
      <OrderStatusOverview />
      <RevenueByCategory />
      <TopOrderByYear />
    </div>
  );
};
export default StatisticalSales;
