import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import React from "react";
import { useBackend } from "main/utils/useBackend";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemIndexPage() {
  
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/diningcommonsmenuitems/create"
          style={{ float: "right" }}
        >
          Create UCSB Dining Commons Menu Item
        </Button>
      );
    }
  };

  const {
    data: menuItems,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbdiningcommonsmenuitem/all"],
    { method: "GET", url: "/api/ucsbdiningcommonsmenuitem/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
      {createButton()}
        <h1>UCSB Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemTable menuItems={menuItems} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
