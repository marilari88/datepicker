import {
  CalendarDate,
  createCalendar,
  DateValue,
  getWeeksInMonth,
} from "@internationalized/date";
import { clsx } from "clsx";
import { useRef } from "react";
import {
  AriaCalendarGridProps,
  AriaCalendarProps,
  AriaDatePickerProps,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useDatePicker,
  useLocale,
} from "react-aria";
import {
  CalendarState,
  useCalendarState,
  useDatePickerState,
} from "react-stately";

export function DatePicker(props: AriaDatePickerProps<DateValue>) {
  const ref = useRef(null);
  const state = useDatePickerState(props);
  const { labelProps, fieldProps, calendarProps } = useDatePicker(
    props,
    state,
    ref
  );

  return (
    <div className="flex flex-col gap-2">
      <label {...labelProps}>Scegli la data</label>
      <input
        className="border"
        {...{
          /* ...fieldProps, */
          value: fieldProps.value?.toString(),
          onChange: () => {
            fieldProps.onChange;
          },
          defaultValue: fieldProps.defaultValue?.toString(),
        }}
        type="text"
        placeholder="____/__/__"
      />
      <Calendar {...calendarProps} />
    </div>
  );
}

function Calendar(props: AriaCalendarProps<DateValue>) {
  const ref = useRef(null);
  const { locale } = useLocale();
  const state = useCalendarState({ ...props, createCalendar, locale });
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state);
  return (
    <div {...calendarProps} ref={ref} className="border">
      <div className="flex flex-row p-4 gap-4 items-center">
        <div>{title}</div>
        <button
          /* https://github.com/adobe/react-spectrum/blob/ff3e690fffc6c54367b8057e28a0e5b9211f37b5/packages/%40react-aria/interactions/src/usePress.ts#L181 */
          onClick={(e) =>
            prevButtonProps.onPress?.({
              type: "press",
              pointerType: "mouse",
              target: e.target as Element,
              shiftKey: e.shiftKey,
              metaKey: e.metaKey,
              ctrlKey: e.ctrlKey,
              altKey: e.altKey,
            })
          }
          disabled={prevButtonProps.isDisabled}
          className="bg-red-400 p-2 leading-none"
        >
          &lt;
        </button>
        <button
          onClick={(e) =>
            nextButtonProps.onPress?.({
              type: "press",
              pointerType: "mouse",
              target: e.target as Element,
              shiftKey: e.shiftKey,
              metaKey: e.metaKey,
              ctrlKey: e.ctrlKey,
              altKey: e.altKey,
            })
          }
          disabled={prevButtonProps.isDisabled}
          className="bg-red-400 p-2 leading-none"
        >
          &gt;
        </button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

function CalendarGrid({
  state,
  ...props
}: {
  state: CalendarState;
} & AriaCalendarGridProps) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
  return (
    <div {...gridProps}>
      <div {...headerProps} className="grid grid-cols-7 font-bold">
        {weekDays.map((day, index) => (
          <div key={`day ${index}`} className="p-2 flex flex-col items-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {[...new Array(weeksInMonth).keys()].map((w) => {
          return state
            .getDatesInWeek(w)
            .map((date, i) =>
              date ? (
                <CalendarCell key={`${w}-${i}`} state={state} date={date} />
              ) : (
                <div></div>
              )
            );
        })}
      </div>
    </div>
  );
}

function CalendarCell({
  state,
  date,
}: {
  state: CalendarState;
  date: CalendarDate;
}) {
  const ref = useRef(null);
  const {
    cellProps,
    buttonProps,
    isOutsideVisibleRange,
    formattedDate,
    isFocused,
  } = useCalendarCell({ date }, state, ref);
  return (
    <div
      {...cellProps}
      ref={ref}
      className={clsx(
        isOutsideVisibleRange && "text-gray-300",
        isFocused && "bg-red-200",
        "flex flex-col items-center p-2 aria-selected:bg-red-300 hover:bg-red-100"
      )}
    >
      <button {...buttonProps}>{formattedDate}</button>
    </div>
  );
}
