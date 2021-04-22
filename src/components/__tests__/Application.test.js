import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  prettyDOM,
} from "@testing-library/react";

import Application from "../Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  // test 1
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText, debug } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
      debug();
    });
  });

  // test 2
  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // click the add button
    fireEvent.click(getByAltText(appointment, "Add"));

    // enter student name in the form and click the interview list item
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer")); // image alt

    // click the save button
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

    debug();
  });

  // test 3
  it("loads data, cancels an interview, and increases the spots remaining for the first day by 1", async () => {
    // 1. render the application
    const { container, debug } = render(<Application />);

    // 2. wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. click on the cancel image of his appointment (belonging to the show component)
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. check that the confirmation message is shown
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    // 5. click on the confirm button of the confirm component
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. check that the element with the text deleting is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 6. check that the number of remaining spots has increased by 1
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  // test 4
  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. render the application
    const { container, debug } = render(<Application />);

    // 2. wait until the text "Archie Cohen is displayed"
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. click on the edit button
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. now in the create mode: change the input field of the form to a new name as well as the interviewer
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Harry Dough" },
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

    // 5. click on the save button of the form
    fireEvent.click(getByText(appointment, "Save"));

    // 6. check the saving message
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. wait until the element with the new name is displayed
    await waitForElement(() => getByText(appointment, "Harry Dough"));

    // 8. check that the number of remaining spots has increased by 1
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    // 9. confirm that we have the same number of spots as before (1)
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  // test 5
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce(new Error("Saving error occured"));
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Harry Dough" },
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Saving error occured"));
    expect(getByText(appointment, "Saving error occured")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Deleting error occured"));
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() =>
      getByText(appointment, "Deleting error occured")
    );
    expect(
      getByText(appointment, "Deleting error occured")
    ).toBeInTheDocument();
  });
});
