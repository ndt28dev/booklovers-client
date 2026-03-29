import StatisticalTopOrder from "../statisticaltoporder/StatisticalTopOrder";
import StatisticalTopUser from "../statisticaltopuser/StatisticalTopUser";
import CustomersCLV from "./contai/CustomersCLV";
import CustomersOverview from "./contai/CustomersOverview";

const StatisticalCustomers = () => {
  return (
    <div>
      <CustomersOverview />
      <CustomersCLV />
      {/* <StatisticalTopUser />
      <StatisticalTopOrder /> */}
    </div>
  );
};
export default StatisticalCustomers;
