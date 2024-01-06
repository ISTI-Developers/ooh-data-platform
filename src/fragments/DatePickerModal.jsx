import { Button, Label } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import PropTypes from "prop-types";
import { inlineDatePickerTheme, lightButtonTheme } from "../config/themes";
import { useState } from "react";
import { endOfDay, format, startOfDay, subDays } from "date-fns";

function DatePickerModal({ show, onClose, setDate }) {
  const [selectedDate, setDates] = useState({
    to: new Date(),
    from: new Date(),
  });

  const onChangeDate = (e) => {
    const date = e.value;
    const id = e.id;
    console.log(e);
    setDates((prev) => ({ ...prev, [id]: new Date(date) }));
  };
  const onSelectPreset = (length) => {
    const endDate = new Date(); // Today
    const startDate = subDays(endDate, length);

    setDates({
      from: startOfDay(startDate),
      to: endOfDay(endDate),
    });
  };

  const onSubmit = () => {
    setDate(selectedDate);
    onClose();
  };
  return (
    show && (
      <div className="absolute top-full min-w-[200px] bg-white shadow p-4 mt-4 border animate-fade flex flex-col gap-2 rounded-lg z-[2]">
        <div className="flex items-center gap-2">
          {[7, 15, 30].map((len) => {
            return (
              <Button
                theme={lightButtonTheme}
                color="transparent"
                className="border-2 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                onClick={() => onSelectPreset(len)}
                key={len}
              >{`Past ${len} days`}</Button>
            );
          })}
        </div>
        <p className="pt-4 font-semibold text-main">Custom Date Range</p>
        <div className="flex gap-4">
          <div className="bg-default rounded-md p-2">
            <Label htmlFor="from" className="text-lg">From:</Label>
            <Datepicker
              id="from"
              inline
              theme={inlineDatePickerTheme}
              value={format(new Date(selectedDate.from), "yyyy-MM-dd")}
              onSelectedDateChanged={(date) =>
                onChangeDate({ value: date, id: "from" })
              }
              showTodayButton={false}
              showClearButton={false}
            />
          </div>
          <div className="bg-default rounded-md p-2">
            <Label htmlFor="to" className="text-lg">To:</Label>
            <Datepicker
              id="to"
              inline
              theme={inlineDatePickerTheme}
              value={format(new Date(selectedDate.to), "yyyy-MM-dd")}
              onSelectedDateChanged={(date) =>
                onChangeDate({ value: date, id: "to" })
              }
              showTodayButton={false}
              showClearButton={false}
            />
          </div>
        </div>
        <div className="flex gap-2 ml-auto pt-2">
          <Button
            theme={lightButtonTheme}
            color="light"
            className="text-white"
            onClick={onSubmit}
          >
            Submit
          </Button>
          <Button
            theme={lightButtonTheme}
            color="transparent"
            className="border-2 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  );
}

DatePickerModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  setDate: PropTypes.func,
};

export default DatePickerModal;
