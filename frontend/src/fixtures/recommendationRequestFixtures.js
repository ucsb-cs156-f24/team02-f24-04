const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "test@gmail.com",
    professorEmail: "sample@gmail.com",
    explanation: "test explanation",
    dateRequested: "2022-1-03T00:00:00",
    dateNeeded: "2022-1-03T00:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "test1@gmail.com",
      professorEmail: "sample1@gmail.com",
      explanation: "test explanation 1",
      dateRequested: "2022-1-03T00:00:00",
      dateNeeded: "2022-1-03T00:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "test2@gmail.com",
      professorEmail: "sample2@gmail.com",
      explanation: "test explanation 2",
      dateRequested: "2023-1-03T00:00:00",
      dateNeeded: "2023-1-03T00:00:00",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "test3@gmail.com",
      professorEmail: "sample3@gmail.com",
      explanation: "test explanation 3",
      dateRequested: "2024-1-03T00:00:00",
      dateNeeded: "2024-1-03T00:00:00",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
