const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "student@ucsb.edu",
    stars: 4,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "Pasta was delicious!",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 2,
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "I love the Apple Pie",
    },
    {
      id: 1,
      itemId: 3,
      reviewerEmail: "ldelplaya@ucsb.edu",
      stars: 0,
      dateReviewed: "2022-01-02T12:15:00",
      comments: "I hate the Pumpkin Pie",
    },
    {
      id: 1,
      itemId: 4,
      reviewerEmail: "test@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-02-14T12:30:00",
      comments: "Breakfast Burrito was cold",
    },
  ],
};

export { menuItemReviewFixtures };
