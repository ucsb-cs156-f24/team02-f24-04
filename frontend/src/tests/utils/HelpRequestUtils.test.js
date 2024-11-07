import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/HelpRequestUtils";
import mockConsole from "jest-mock-console";

// Mock the toast function
const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("HelpRequestUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // Arrange
      const restoreConsole = mockConsole();

      // Act
      onDeleteSuccess("Test message");

      // Assert
      expect(mockToast).toHaveBeenCalledWith("Test message");
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("Test message");

      // Clean up
      restoreConsole();
    });
  });

  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // Arrange
      const cell = { row: { values: { id: 42 } } };

      // Act
      const result = cellToAxiosParamsDelete(cell);

      // Assert
      expect(result).toEqual({
        url: "/api/helprequest",
        method: "DELETE",
        params: { id: 42 },
      });
    });
  });
});
