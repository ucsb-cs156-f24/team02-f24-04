const helpRequestFixtures = {
  oneHelpRequest: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      teamId: "team01",
      tableOrBreakoutRoom: "Table 5",
      requestTime: "2024-11-04T15:30:00",
      explanation: "Need help with understanding the assignment requirements.",
      solved: false,
    },
  ],

  threeHelpRequests: [
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      teamId: "team12",
      tableOrBreakoutRoom: "Breakout Room A",
      requestTime: "2024-11-04T14:00:00",
      explanation: "Having trouble with code implementation.",
      solved: true,
    },

    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      teamId: "team04",
      tableOrBreakoutRoom: "Table 3",
      requestTime: "2024-11-04T16:45:00",
      explanation: "Need clarification on project guidelines.",
      solved: false,
    },

    {
      id: 4,
      requesterEmail: "student4@ucsb.edu",
      teamId: "team07",
      tableOrBreakoutRoom: "Breakout Room B",
      requestTime: "2024-11-04T13:30:00",
      explanation: "Experiencing issues with Git and version control.",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };
