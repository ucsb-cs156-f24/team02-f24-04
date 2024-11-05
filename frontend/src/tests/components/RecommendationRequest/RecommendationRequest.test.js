import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures, RecommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequest tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Create/);
    await screen.findByText(/Cancel/);
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Professor Email/);
    await screen.findByText(/Explanation/);
    await screen.findByText(/Date Requested/);
    await screen.findByText(/Date Needed/);
    await screen.findByText(/Done/);
  });

  test("renders correctly when passing in a RecommendationRequest", async () => {
    render(
      <Router>
        <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequest-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequest-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
    const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
    const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");
    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(professorEmailField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "bad-input" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.change(doneField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    //await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-submit");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);
    expect(
      screen.getByText(/Professor Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
    const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
    const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
    const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
    const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, {target: { value: "test@gmail.com" }});
    fireEvent.change(professorEmailField, {target: { value: "sample@gmail.com" }});
    fireEvent.change(explanationField, {target: { value: "test explanation" }});
    fireEvent.change(dateRequestedField, {target: { value: "2023-01-01T12:00" }});
    fireEvent.change(dateNeededField, {target: { value: "2023-01-01T12:00" }});
    fireEvent.change(doneField, {target: { value: "true"}});
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
        screen.queryByText(/Requester Email is required./),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Professor Email is required./),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Explanation is required./),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Date Requested is required./),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Date Needed is required./),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Done is required./),
      ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-cancel");
    const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");


    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
