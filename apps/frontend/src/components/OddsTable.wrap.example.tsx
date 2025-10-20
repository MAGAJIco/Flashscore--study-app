// Example: how to update existing gambling components to respect Kids Mode.
// Replace rendering of OddsTable with ProtectedGambling wrapper.
import React from "react";
import { ProtectedGambling } from "./ProtectedGambling";
import OddsTable from "./OddsTable"; // existing component

export const OddsTableWithProtection: React.FC = () => {
  return (
    <ProtectedGambling fallback={<div>Odds are hidden in Kids Mode.</div>}>
      <OddsTable />
    </ProtectedGambling>
  );
};
