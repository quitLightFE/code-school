"use client";

import { AlertDialog, Button, PressEvent } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

interface AlertLogOutProps {
  isLogoutOpen: boolean;
  setIsLogoutOpen: Dispatch<SetStateAction<boolean>>;
  // Если logout принимает событие нажатия (PressEvent), используем (e?: PressEvent) => void
  handleConfirmLogout: (e?: PressEvent) => void;
}

export default function AlertLogOut({
  isLogoutOpen,
  setIsLogoutOpen,
  handleConfirmLogout,
}: AlertLogOutProps) {
  return (
    <AlertDialog isOpen={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Log out of your account?
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Are you sure you want to log out? You will need to sign back in
                to access your dashboard.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                slot="close"
                variant="tertiary"
                onPress={() => setIsLogoutOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onPress={handleConfirmLogout}>
                Log out
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
