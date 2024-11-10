import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const testIdPrefix = "HelpRequestForm";
const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
  const renderForm = (props = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm {...props} />
        </Router>
      </QueryClientProvider>,
    );

  test("renders correctly with no initialContents", async () => {
    renderForm();
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
  });

  test("displays error message when Team ID is missing", async () => {
    renderForm();

    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => {
      expect(screen.getByText(/Team ID is required/)).toBeInTheDocument();
    });
  });

  test("renders form without initial contents", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    // Expect form elements without initial content values
  });

  test("renders form with initial contents", () => {
    const initialContents = {
      id: "123",
      requesterEmail: "test@ucsb.edu",
      teamId: "42" /* other fields */,
    };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm initialContents={initialContents} />
        </Router>
      </QueryClientProvider>,
    );
    // Expect form elements with initial content values set
  });

  test("displays required error for requesterEmail", async () => {
    render(<HelpRequestForm />);
    fireEvent.submit(screen.getByTestId("HelpRequestForm-submit"));
    await waitFor(() => {
      expect(
        screen.getByText("Requester email is required."),
      ).toBeInTheDocument();
    });
  });

  test("does not render id field when initialContents is undefined", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId("HelpRequestForm-id")).not.toBeInTheDocument();
  });

  test("renders disabled id field when initialContents is provided", () => {
    const initialContents = { id: "123" };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm initialContents={initialContents} />
        </Router>
      </QueryClientProvider>,
    );
    const idField = screen.getByTestId("HelpRequestForm-id");
    expect(idField).toBeInTheDocument();
    expect(idField).toBeDisabled();
  });

  test("accepts a valid email format", async () => {
    render(<HelpRequestForm />);
    const emailInput = screen.getByTestId("HelpRequestForm-requesterEmail");
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.submit(screen.getByTestId("HelpRequestForm-submit"));
    await waitFor(() => {
      expect(
        screen.queryByText("Invalid email format"),
      ).not.toBeInTheDocument();
    });
  });

  test("sets defaultValues to empty object when initialContents is undefined", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(screen.queryByTestId("HelpRequestForm-id")).not.toBeInTheDocument();
  });

  test("uses initialContents as defaultValues when provided", () => {
    const initialContents = { id: "123", requesterEmail: "test@ucsb.edu" };
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm initialContents={initialContents} />
        </Router>
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("HelpRequestForm-id")).toHaveValue("123");
    expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toHaveValue(
      "test@ucsb.edu",
    );
  });

  test("shows required error messages when fields are empty", async () => {
    render(<HelpRequestForm />);
    const submitButton = screen.getByTestId("HelpRequestForm-submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Requester email is required."),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Team ID is required.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByText("Table or Breakout Room is required."),
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Request time is required.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Explanation is required.")).toBeInTheDocument();
    });
  });

  test("accepts various valid email formats", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <HelpRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    const emailInput = screen.getByTestId("HelpRequestForm-requesterEmail");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    const validEmails = [
      "simple@example.com",
      "very.common@example.com",
      "disposable.style.email.with+symbol@example.com",
      "other.email-with-hyphen@example.com",
      "fully-qualified-domain@example.com",
      "user.name+tag+sorting@example.com",
      "x@example.com",
      "example-indeed@strange-example.com",
      "admin@mailserver1",
      "user%example.com@example.org",
      "user-@example.org",
    ];

    for (const email of validEmails) {
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Check that the error message is NOT present
        expect(
          screen.queryByText("Invalid email format"),
        ).not.toBeInTheDocument();
      });
    }
  });

  test("displays error message when Table or Breakout Room is missing", async () => {
    renderForm();

    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => {
      expect(
        screen.getByText(/Table or Breakout Room is required/),
      ).toBeInTheDocument();
    });
  });

  test("displays error message when Request Time is missing", async () => {
    renderForm();

    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => {
      expect(screen.getByText(/Request time is required/)).toBeInTheDocument();
    });
  });

  test("displays error message when Explanation exceeds max length", async () => {
    renderForm();

    const explanationInput = screen.getByTestId(`${testIdPrefix}-explanation`);
    fireEvent.change(explanationInput, { target: { value: "a".repeat(501) } });
    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => {
      expect(
        screen.getByText(/Explanation must be under 500 characters/),
      ).toBeInTheDocument();
    });
  });

  test("toggles Solved checkbox", async () => {
    renderForm();

    const solvedCheckbox = screen.getByTestId(`${testIdPrefix}-solved`);
    fireEvent.click(solvedCheckbox);
    expect(solvedCheckbox).toBeChecked();

    fireEvent.click(solvedCheckbox);
    expect(solvedCheckbox).not.toBeChecked();
  });

  test("submits form successfully with valid inputs", async () => {
    const submitAction = jest.fn();
    renderForm({ submitAction });

    fireEvent.change(screen.getByTestId(`${testIdPrefix}-requesterEmail`), {
      target: { value: "valid@example.com" },
    });
    fireEvent.change(screen.getByTestId(`${testIdPrefix}-teamId`), {
      target: { value: "Team1" },
    });
    fireEvent.change(
      screen.getByTestId(`${testIdPrefix}-tableOrBreakoutRoom`),
      { target: { value: "Table 1" } },
    );
    fireEvent.change(screen.getByTestId(`${testIdPrefix}-requestTime`), {
      target: { value: "2024-11-05T15:30" },
    });
    fireEvent.change(screen.getByTestId(`${testIdPrefix}-explanation`), {
      target: { value: "This is a valid explanation." },
    });
    fireEvent.click(screen.getByTestId(`${testIdPrefix}-solved`));
    fireEvent.click(screen.getByText(/Create/));

    await waitFor(() => {
      expect(submitAction).toHaveBeenCalled();
    });
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    renderForm();

    const cancelButton = screen.getByTestId(`${testIdPrefix}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
