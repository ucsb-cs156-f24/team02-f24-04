import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    // await screen.findByText(/Quarter YYYYQ/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId(/ArticlesForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");
    const titleField = screen.getByTestId("ArticlesForm-title");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "bad-input" } });
    fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    //await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-submit");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/title is required./);
    expect(screen.getByText(/url is required./)).toBeInTheDocument();
    expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/email is required./)).toBeInTheDocument();
    expect(screen.getByText(/dateAdded is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "20221" } });
    fireEvent.change(urlField, { target: { value: "something.com" } });
    fireEvent.change(explanationField, { target: { value: "explanation" } });
    fireEvent.change(emailField, { target: { value: "email" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    // expect(
    //   screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)
    // ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/dateAdded must be in ISO format/),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-cancel");
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
