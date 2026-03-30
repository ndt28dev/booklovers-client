import ContactsOverview from "./contai/ContactsOverview";
import ReviewsOverview from "./contai/ReviewsOverview";
import TopBooksMostReviews from "./contai/TopBooksMostReviews";

const StatisticalReviewsAndContacts = () => {
  return (
    <div>
      <ContactsOverview />
      <ReviewsOverview />
      <TopBooksMostReviews />
    </div>
  );
};
export default StatisticalReviewsAndContacts;
