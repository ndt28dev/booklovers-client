import ContactsOverview from "./contai/ContactsOverview";
import ReviewsOverview from "./contai/ReviewsOverview";
import TopBooksHighestRating from "./contai/TopBooksHighestRating";
import TopBooksMostReviews from "./contai/TopBooksMostReviews";

const StatisticalReviewsAndContacts = () => {
  return (
    <div>
      <ContactsOverview />
      <ReviewsOverview />
      <TopBooksMostReviews />
      <TopBooksHighestRating />
    </div>
  );
};
export default StatisticalReviewsAndContacts;
