import StatisticalHeader from "../statisticalheader/StatisticalHeader";
import StatisticalOverview from "../statisticaloverview/StatisticalOverview";
import StatisticalTopOrder from "../statisticaltoporder/StatisticalTopOrder";
import StatisticalTopUser from "../statisticaltopuser/StatisticalTopUser";

const StatisticalCustomers = () => {
  return (
    <div>
      <StatisticalHeader />
      <StatisticalOverview />
      <StatisticalTopUser />
      <StatisticalTopOrder />
    </div>
  );
};
export default StatisticalCustomers;
