import { toast } from "react-toastify";

export function onDeleteSuccess(response) {
  const message =
    response?.data?.message || "Organization deleted successfully";
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/organizations",
    method: "DELETE",
    params: {
      orgCode: cell.row.values.orgCode,
    },
  };
}
