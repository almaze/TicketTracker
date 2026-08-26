import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../page";

describe("RegisterPage", () => {
    it("shows a validation error when fields are empty", async () => {
        const user = userEvent.setup();

        render(<RegisterPage />);

        const registerButton = screen.getByRole("button", {
            name: "Register",
        });

        await user.click(registerButton);

        expect(
            screen.getByText("Email and password are required.")
        ).toBeInTheDocument();
    });
});