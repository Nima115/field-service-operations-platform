import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CalendarCheck } from "lucide-react";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders metric content", () => {
    render(<StatCard label="Open bookings" value="37" detail="9 require assignment" icon={CalendarCheck} />);

    expect(screen.getByText("Open bookings")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
  });
});
