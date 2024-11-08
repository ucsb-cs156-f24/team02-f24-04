import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequest", async () => {
    const helpRequest = {
      id: 3,
      requesterEmail: "testuser@ucsb.edu",
      teamId: "team123",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2023-01-01T12:00",
      explanation: "Need help with project setup",
      solved: true,
    };

    axiosMock.onPost("/api/helprequest/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText("Requester Email");
    const teamIdInput = screen.getByLabelText("Team ID");
    const tableInput = screen.getByLabelText("Table or Breakout Room");
    const requestTimeInput = screen.getByLabelText("Request Time");
    const explanationInput = screen.getByLabelText("Explanation");
    const solvedCheckbox = screen.getByLabelText("Solved");
    const createButton = screen.getByText("Create");

    fireEvent.change(emailInput, { target: { value: "testuser@ucsb.edu" } });
    fireEvent.change(teamIdInput, { target: { value: "team123" } });
    fireEvent.change(tableInput, { target: { value: "Table 1" } });
    fireEvent.change(requestTimeInput, { target: { value: "2023-01-01T12:00" } });
    fireEvent.change(explanationInput, { target: { value: "Need help with project setup" } });
    fireEvent.click(solvedCheckbox);
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    // Check that the backend request matches the expected format
    const receivedData = JSON.parse(axiosMock.history.post[0].data);
    expect(receivedData).toMatchObject({
      requesterEmail: "testuser@ucsb.edu",
      teamId: "team123",
      tableOrBreakoutRoom: "Table 1",
      requestTime: "2023-01-01T12:00",
      explanation: "Need help with project setup",
      solved: true,
    });

    // Check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New Help Request Created - id: 3 requesterEmail: testuser@ucsb.edu"
    );

    // Check that navigation was triggered to /helprequest
    expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
  });
});
