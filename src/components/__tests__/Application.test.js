import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByPlaceholderText, getByAltText, queryByText, prettyDOM } from "@testing-library/react";

import Application from "../Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  
  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // click the add button
    fireEvent.click(getByAltText(appointment, "Add"));

    // enter student name in the form and click the interview list item
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Yeast West" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer")); // image alt

    // click the save button
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Yeast West"));

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
})
